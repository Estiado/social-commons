// Embed only faces the browser has actually loaded. A CJK CSS file can declare hundreds of
// unused Unicode subsets; downloading all of them on a click would block navigation.
const resources = new Map<string, Promise<string>>();
const sheets = new Map<string, Promise<string>>();
const normal = (value: string) => value.replace(/[\s'"]/g, '').toLowerCase();
const key = (family: string, weight: string, style: string, range: string) =>
  [normal(family), weight === 'normal' ? '400' : weight, style || 'normal', normal(range)].join(
    '|',
  );
const timedFetch = (url: string) =>
  fetch(url, { signal: AbortSignal.timeout(1400), credentials: 'omit' }).then((response) => {
    if (!response.ok) throw new Error('Font resource unavailable');
    return response;
  });
export async function snapshotFonts(root: HTMLElement) {
  const points = [
    ...new Set(Array.from(root.textContent || '', (character) => character.codePointAt(0)!)),
  ].sort((a, b) => a - b);
  const used = (range: string) =>
    range.split(',').some((part) => {
      const [start, end] = part.trim().replace(/^U\+/i, '').split('-');
      const low = parseInt(start.replace(/\?/g, '0'), 16);
      const high = parseInt((end || start).replace(/\?/g, 'f'), 16);
      let left = 0,
        right = points.length;
      while (left < right) {
        const middle = (left + right) >>> 1;
        if (points[middle] < low) left = middle + 1;
        else right = middle;
      }
      return left < points.length && points[left] <= high;
    });
  const loaded = new Set(
    [...document.fonts]
      .filter((face) => face.status === 'loaded' && used(face.unicodeRange))
      .map((face) => key(face.family, face.weight, face.style, face.unicodeRange)),
  );
  if (!loaded.size) return '';
  const rules: { css: string; base: string }[] = [];
  const seen = new Set<CSSStyleSheet>();
  const visitUrl = async (url: string) => {
    let source = sheets.get(url);
    if (!source) {
      source = timedFetch(url).then((r) => r.text());
      sheets.set(url, source);
    }
    const parsed = new CSSStyleSheet();
    parsed.replaceSync(await source);
    await visit(parsed, url);
  };
  const visit = async (sheet: CSSStyleSheet, base: string) => {
    if (seen.has(sheet)) return;
    seen.add(sheet);
    let items: CSSRuleList;
    try {
      items = sheet.cssRules;
    } catch {
      if (sheet.href) await visitUrl(sheet.href);
      return;
    }
    for (const rule of items) {
      if (rule instanceof CSSImportRule) {
        if (rule.styleSheet) await visit(rule.styleSheet, rule.href);
        else await visitUrl(rule.href);
      } else if (rule instanceof CSSFontFaceRule) {
        const style = rule.style;
        const id = key(
          style.getPropertyValue('font-family'),
          style.getPropertyValue('font-weight') || '400',
          style.getPropertyValue('font-style') || 'normal',
          style.getPropertyValue('unicode-range') || 'U+0-10FFFF',
        );
        if (loaded.has(id)) rules.push({ css: rule.cssText, base });
      }
    }
  };
  await Promise.all(
    [...document.styleSheets].map((sheet) => visit(sheet, sheet.href || location.href)),
  );
  const embed = (url: string) => {
    let data = resources.get(url);
    if (!data) {
      data = timedFetch(url)
        .then((r) => r.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }),
        );
      resources.set(url, data);
      if (resources.size > 96) resources.delete(resources.keys().next().value!);
      data.catch(() => resources.delete(url));
    }
    return data;
  };
  const output = await Promise.all(
    rules.map(async ({ css, base }) => {
      for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
        css = css.replace(match[0], `url("${await embed(new URL(match[1], base).href)}")`);
      }
      return css;
    }),
  );
  if (!output.length) throw new Error('Loaded font faces unavailable for capture');
  return output.join('\n');
}
