import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { EVENTS } from '../src/data/events.ts';
import { HISTORY_READINGS } from '../src/data/history/readings.ts';
import { QUOTES } from '../src/data/quotes.ts';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import {
  eventDocument,
  quoteDocument,
  dailyDocument,
} from '../src/features/reading/contentDocuments.ts';
import { referenceParagraph, nameCatalogueReferences } from '../src/features/reading/references.ts';
import { readingTextSegments } from '../src/features/reading/textSegments.ts';
import { createAnnotation } from '../src/features/reading/model.ts';

test('群鉴每条先有背景再有可定位的著述摘读，没有自拟课堂题冒充观点', () => {
  assert.equal(EVENTS.length, 10);
  assert.equal(
    EVENTS.reduce((sum, event) => sum + event.perspectives.length, 0),
    30,
  );
  for (const event of EVENTS) {
    assert.ok(event.summary.length >= 180, event.id);
    assert.ok(event.summarySources.length > 0, event.id);
    const document = eventDocument(event);
    const text = document.blocks
      .flatMap((block) => ('text' in block ? [block.text] : []))
      .join('\n');
    assert.ok(text.indexOf('事件概述') < text.indexOf('多方视角'));
    assert.doesNotMatch(text, /课堂讨论|本站讨论题|本站设计的|百晓智能|文献检索结果|非逐字引语/u);
    for (const view of event.perspectives) {
      assert.ok(view.quote && view.original && view.locator, `${event.id}/${view.id}`);
      assert.ok(new URL(view.sourceUrl));
      assert.ok(
        document.blocks.some(
          (block) => 'text' in block && block.spans?.some((span) => span.href === view.sourceUrl),
        ),
      );
      if (view.readingId) {
        const reading = HISTORY_READINGS[view.readingId];
        assert.ok(reading, view.readingId);
        const index = document.blocks.findIndex(
          (block) => 'text' in block && block.text === view.locator,
        );
        assert.ok(
          'text' in document.blocks[index + 1] && document.blocks[index + 1].resource,
          view.readingId,
        );
      }
    }
  }
});

test('预存文献与清单逐字节相符，PDF是真文件，古籍保留原电子版许可', () => {
  assert.match(readFileSync('public/_headers', 'utf8'), /X-Frame-Options: SAMEORIGIN/u);
  const manifest = JSON.parse(readFileSync('public/readings/history/manifest.json', 'utf8'));
  const readings = Object.values(HISTORY_READINGS).filter((reading) => reading.file);
  assert.equal(readings.length, manifest.length);
  for (const reading of readings) {
    assert.match(reading.file!, /^[a-z0-9-]+\.(pdf|txt)$/u);
    const bytes = readFileSync(`public/readings/history/${reading.file}`);
    const entry = manifest.find((item: { file: string }) => item.file === reading.file);
    assert.equal(bytes.length, entry.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    if (reading.format === 'PDF') assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    else assert.match(bytes.toString(), /Project Gutenberg.*License/isu);
  }
});

test('站内正文引用以标题显示，来源URL保留在格式信息中，名句不展示编辑要求', () => {
  for (const document of [
    ...EVENTS.map(eventDocument),
    ...QUOTES.map(quoteDocument),
    ...DAILY_KNOWLEDGE.map(dailyDocument),
  ]) {
    for (const block of document.blocks) {
      if (!('text' in block)) continue;
      assert.doesNotMatch(block.text, /https?:\/\//u, document.title);
      assert.doesNotMatch(block.text, /依据已发布资料整理|非逐字引语|资料观点不等于唯一解释/u);
    }
  }
  const reference = referenceParagraph(
    '《陋室铭》赏析重点',
    'https://example.com/source.pdf',
    '来源：',
  );
  assert.equal(reference.text, '来源：《陋室铭》赏析重点');
  assert.equal(reference.spans?.[0].start, 3);
  assert.equal(
    nameCatalogueReferences({ type: 'paragraph', text: '研究题目。https://example.com/a.pdf' })
      .text,
    '研究题目',
  );
});

test('题名链接与交叉划线共同分段，保留可见文本、链接与字符偏移', () => {
  const document = quoteDocument(QUOTES.find((quote) => quote.id === 'q59')!);
  const block = {
    id: 'reference',
    ...referenceParagraph('一份研究的可读标题', 'https://example.com/study', '参见：'),
  };
  const source = { ...document, blocks: [block] };
  const annotation = createAnnotation(source, block.id, 1, 8, 'highlight');
  const segments = readingTextSegments(block, [annotation]);
  assert.equal(segments.map((segment) => segment.text).join(''), block.text);
  assert.equal(
    segments
      .filter((segment) => segment.saved)
      .map((segment) => segment.text)
      .join(''),
    block.text.slice(1, 8),
  );
  assert.equal(
    segments
      .filter((segment) => segment.href)
      .map((segment) => segment.text)
      .join(''),
    '一份研究的可读标题',
  );
});
