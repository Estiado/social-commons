import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

export const EDITORIAL_FILE = 'content/站内编辑稿.md';
const groupPattern = /^[A-Za-z][A-Za-z0-9]*(?:\/[A-Za-z][A-Za-z0-9]*)*$/u;
const keyPattern = /^[A-Za-z0-9_.:-]+$/u;
const startPattern = /^<!-- copy: ([^#\s]+)#([^\s]+) -->$/u;

/** Plain text only: no Markdown execution, HTML parsing, or executable front matter. */
export function parseEditorialCopy(markdown: string) {
  if (Buffer.byteLength(markdown) > 5 * 1024 * 1024) throw new Error('编辑稿超过5 MiB');
  const groups = new Map<string, Record<string, string>>();
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let active: { group: string; key: string; line: number; body: string[] } | undefined;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const start = startPattern.exec(line);
    if (start) {
      if (active) throw new Error(`编辑稿第${index + 1}行：上一段缺少结束标记`);
      const [, group, key] = start;
      if (!groupPattern.test(group) || !keyPattern.test(key))
        throw new Error(`编辑稿第${index + 1}行：编号格式不正确`);
      active = { group, key, line: index + 1, body: [] };
    } else if (line === '<!-- /copy -->') {
      if (!active) throw new Error(`编辑稿第${index + 1}行：多余的结束标记`);
      const text = active.body.join('\n');
      if (!text.trim() || text.length > 30_000 || text.includes('\0'))
        throw new Error(`编辑稿第${active.line}行：正文为空、过长或含无效字符`);
      const group = groups.get(active.group) || {};
      if (Object.hasOwn(group, active.key))
        throw new Error(`编辑稿重复编号：${active.group}#${active.key}`);
      Object.defineProperty(group, active.key, { value: text, enumerable: true });
      groups.set(active.group, group);
      active = undefined;
    } else if (/^<!--\s*\/?copy\b/u.test(line)) {
      throw new Error(`编辑稿第${index + 1}行：内容标记损坏`);
    } else if (active) active.body.push(line);
  }
  if (active) throw new Error(`编辑稿第${active.line}行：缺少结束标记`);
  if (!groups.size) throw new Error('编辑稿没有正文段落');
  return groups;
}

export function renderEditorialModule(copy: Record<string, string>) {
  return (
    '// 自动生成，请编辑 content/站内编辑稿.md。\n' +
    `export const EDITORIAL = ${JSON.stringify(copy, null, 2)} as const;\n` +
    'export function paragraphCopy(key: keyof typeof EDITORIAL): string[] { return EDITORIAL[key].split(/\\n\\s*\\n/u); }\n'
  );
}

export async function generateEditorialContent(root = path.resolve(import.meta.dirname, '..')) {
  const groups = parseEditorialCopy(await readFile(path.join(root, EDITORIAL_FILE), 'utf8'));
  const references = new Map<string, Set<string>>();
  const inspect = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await inspect(file);
      else if (file.endsWith('.ts')) {
        const code = ts.createSourceFile(
          file,
          await readFile(file, 'utf8'),
          ts.ScriptTarget.Latest,
          true,
        );
        const imported = code.statements.flatMap((statement) => {
          if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
            return [];
          const match = /\.artifacts\/editorial\/([A-Za-z0-9/]+)\.ts$/u.exec(
            statement.moduleSpecifier.text,
          );
          return match ? [match[1]] : [];
        });
        if (!imported.length) continue;
        const used = new Set<string>();
        const visit = (node: ts.Node) => {
          if (
            ts.isElementAccessExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === 'EDITORIAL' &&
            ts.isStringLiteral(node.argumentExpression)
          )
            used.add(node.argumentExpression.text);
          if (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === 'paragraphCopy' &&
            node.arguments[0] &&
            ts.isStringLiteral(node.arguments[0])
          )
            used.add(node.arguments[0].text);
          ts.forEachChild(node, visit);
        };
        visit(code);
        for (const group of imported) {
          if (!groups.has(group)) throw new Error(`编辑稿缺少整组正文：${group}`);
          references.set(group, used);
        }
      }
    }
  };
  await inspect(path.join(root, 'src/data'));
  const outputs: { file: string; text: string }[] = [];
  // Validate every reference before writing any generated file. A typo must fail
  // the deployment, not silently remove a paragraph from the public website.
  for (const [group, copy] of groups) {
    const used = references.get(group) || new Set<string>();
    for (const key of used)
      if (!Object.hasOwn(copy, key)) throw new Error(`编辑稿缺少正文：${group}#${key}`);
    for (const key of Object.keys(copy))
      if (!used.has(key)) throw new Error(`编辑稿编号没有对应内容：${group}#${key}`);
    outputs.push({
      file: path.join(root, '.artifacts/editorial', group + '.ts'),
      text: renderEditorialModule(copy),
    });
  }
  const changed: string[] = [];
  for (const { file, text } of outputs) {
    let previous: string | undefined;
    try {
      previous = await readFile(file, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    if (previous === text) continue;
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file + '.tmp', text, 'utf8');
    await rename(file + '.tmp', file);
    changed.push(file);
  }
  return {
    groups: groups.size,
    entries: [...groups.values()].reduce((sum, group) => sum + Object.keys(group).length, 0),
    changed,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await generateEditorialContent();
  console.log(
    `编辑稿已同步：${result.groups}组，${result.entries}处文本，更新${result.changed.length}个构建文件。`,
  );
}
