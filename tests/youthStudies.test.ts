import test from 'node:test';
import assert from 'node:assert/strict';
import { YOUTH_STUDIES, researchCitation } from '../src/data/knowledge/youthStudies.ts';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { ESSAY_MATERIALS } from '../src/data/essay.ts';
import { ESSAY_EXAMPLES } from '../src/data/essayExamples.ts';
import { TOPIC_SPECIALS } from '../src/data/topicSpecials.ts';
import { CURATED_COMMENTARIES } from '../src/data/curatedCommentaries.ts';
import { dailyDocument } from '../src/features/reading/contentDocuments.ts';
import { articleSchema } from '../src/features/reading/model.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';

test('青年研究共用题名与出处，旧目录、近期时评及专题关系保留', () => {
  assert.equal(YOUTH_STUDIES.length, 14);
  assert.equal(
    YOUTH_STUDIES.filter((item) => item.researchSource.journal === '当代青年研究').length,
    7,
  );
  assert.equal(new Set(YOUTH_STUDIES.map((item) => item.researchSource.url)).size, 14);
  for (const item of YOUTH_STUDIES) {
    const daily = DAILY_KNOWLEDGE.find((entry) => entry.id === item.id)!;
    const concept = ESSAY_MATERIALS.find((entry) => entry.id === item.conceptId)!;
    const example = ESSAY_EXAMPLES.find((entry) => entry.conceptId === item.conceptId)!;
    assert.deepEqual(daily.researchSource, item.researchSource);
    assert.equal(daily.content, example.content);
    assert.equal(concept.references?.[0].title, researchCitation(item.researchSource));
    assert.equal(concept.references?.[0].url, example.sourceUrl);
    assert.ok(daily.title.includes(item.concept));
    assert.ok(item.researchSource.authors.length > 0);
    assert.match(item.researchSource.pages, /^\d+–\d+$/u);
    assert.ok(item.researchSource.year <= 2026);
    assert.ok(item.content.split('\n\n').length >= 3);
  }
  const topic = TOPIC_SPECIALS.find((item) => item.id === 'youth-university')!;
  assert.equal(topic.readingFocus, 'research');
  assert.deepEqual(
    topic.relatedDailyIds,
    YOUTH_STUDIES.map((item) => item.id),
  );
  for (let number = 1; number <= 100; number++)
    assert.ok(DAILY_KNOWLEDGE.some((item) => item.id === `d${number}`));
  for (let number = 1; number <= 70; number++)
    assert.ok(ESSAY_MATERIALS.some((item) => item.id === `e${number}`));
  assert.equal(CURATED_COMMENTARIES.length, 50);
  assert.ok(
    !CURATED_COMMENTARIES.some((item) => YOUTH_STUDIES.some((study) => study.id === item.id)),
  );
});

test('研究出处为有题名链接，公开 PDF 进入阅读、编排与导出共用模型', () => {
  let pdfCount = 0;
  for (const item of YOUTH_STUDIES) {
    const document = dailyDocument(DAILY_KNOWLEDGE.find((entry) => entry.id === item.id)!);
    articleSchema.parse(document);
    for (const block of document.blocks) {
      if (!('text' in block)) continue;
      assert.doesNotMatch(block.text, /https?:\/\//u);
      for (const span of block.spans || []) {
        const label = block.text.slice(span.start, span.end);
        assert.ok(label.includes(item.researchSource.title));
      }
    }
    const urls = (doc: typeof document) =>
      doc.blocks.flatMap((block) =>
        'text' in block ? (block.spans || []).map((span) => span.href).filter(Boolean) : [],
      );
    assert.ok(urls(document).includes(item.researchSource.url));
    const restored = editorToDocument(documentToEditor(document), document, document.title);
    assert.ok(urls(restored).includes(item.researchSource.url));
    if (item.researchSource.fullTextUrl) {
      pdfCount++;
      assert.ok(urls(document).includes(item.researchSource.fullTextUrl));
      assert.ok(urls(restored).includes(item.researchSource.fullTextUrl));
    }
  }
  assert.equal(pdfCount, 2);
});
