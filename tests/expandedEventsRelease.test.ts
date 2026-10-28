import test from 'node:test';
import assert from 'node:assert/strict';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { ESSAY_MATERIALS } from '../src/data/essay.ts';
import { ESSAY_EXAMPLES } from '../src/data/essayExamples.ts';
import { QUOTES, QUOTE_CATALOGUE, getQuoteById } from '../src/data/quotes.ts';
import { ATTENTION_STUDIES } from '../src/data/knowledge/attentionAndSystems.ts';
import { SOCIAL_EXPERIENCES } from '../src/data/knowledge/socialExperience.ts';
import { researchCitation } from '../src/data/knowledge/youthStudies.ts';
import { GUANLAN_EVENTS } from '../src/data/guanlan/catalogue.ts';
import { getGuanlanEvent } from '../src/data/guanlan/index.ts';
import { guanlanEventDocument } from '../src/features/guanlan/eventDocument.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';

test('新增事件有完整经过和不同来源，全部正文与提要均可进入同一文稿', async () => {
  const previous = new Set(['heritage-short-video', 'ai-at-work', 'academic-bars']);
  const added = GUANLAN_EVENTS.filter((item) => !previous.has(item.id));
  assert.equal(added.length, 12);
  for (const summary of added) {
    const event = (await getGuanlanEvent(summary.id))!;
    assert.ok(event.recap.paragraphs.length >= 3, summary.id);
    assert.ok(event.recap.paragraphs.join('').length >= 250, summary.id);
    assert.ok(event.background.paragraphs.length >= 2, summary.id);
    assert.ok(
      event.perspectives.every((view) => view.paragraphs.length >= 2),
      summary.id,
    );
    assert.ok(new Set(event.sources.map((item) => item.author)).size >= 2, summary.id);
    assert.ok(
      event.reconsiderations.every((item) => item.paragraphs[0].startsWith('社科通识编辑：')),
    );
    const document = guanlanEventDocument(event);
    const editable = editorToDocument(documentToEditor(document), document, document.title);
    const reading = document.blocks.flatMap((block) => ('text' in block ? [block.text] : []));
    const editing = editable.blocks.flatMap((block) => ('text' in block ? [block.text] : []));
    assert.deepEqual(editing, reading, summary.id);
    for (const paragraph of [
      ...event.recap.paragraphs,
      ...event.perspectives.flatMap((item) => item.paragraphs),
      ...event.sources.flatMap((item) => item.digest),
    ])
      assert.ok(reading.includes(paragraph), summary.id);
  }
});

test('日新与素材共用同一份研究文字，原有条目保留，专著定位不会误排成页码', () => {
  assert.equal(SOCIAL_EXPERIENCES.length, 18);
  assert.equal(DAILY_KNOWLEDGE.length, 139);
  assert.equal(ESSAY_MATERIALS.length, 109);
  assert.equal(ESSAY_EXAMPLES.length, 86);
  for (const study of [...SOCIAL_EXPERIENCES, ...ATTENTION_STUDIES]) {
    const daily = DAILY_KNOWLEDGE.find((item) => item.id === study.id)!;
    const material = ESSAY_MATERIALS.find((item) => item.id === study.conceptId)!;
    const example = ESSAY_EXAMPLES.find((item) => item.conceptId === study.conceptId)!;
    assert.equal(daily.content, example.content);
    assert.equal(material.description, daily.summary);
    assert.equal(material.references?.[0].url, daily.researchSource?.url);
    assert.ok(daily.content.split('\n\n').length >= 3, study.id);
    assert.ok(daily.content.length >= 250, study.id);
  }
  const book = SOCIAL_EXPERIENCES.find((item) => item.id === 'd115')!.researchSource;
  assert.match(researchCitation(book), /1983年，第1章及第6章$/u);
  assert.doesNotMatch(researchCitation(book), /章页/u);
});

test('新增古典摘读保留完整作品和具体赏析出处，不改变旧作品别名', () => {
  assert.equal(QUOTES.length, 110);
  assert.equal(QUOTE_CATALOGUE.length, 100);
  for (let number = 99; number <= 110; number++) {
    const quote = getQuoteById(`q${number}`)!;
    assert.ok(quote.text.includes('\n'), quote.id);
    assert.ok(quote.commentary?.text.includes('\n\n'), quote.id);
    assert.ok(quote.sourceUrl && quote.commentary?.url);
    assert.match(quote.commentary!.commentatorSource, /第.+页|第二至四节/u);
  }
  assert.equal(getQuoteById('q50')!.canonicalId, 'q23');
  assert.match(getQuoteById('q99')!.text, /世有伯乐[\s\S]*其真不知马也！$/u);
  assert.equal(getQuoteById('q106')!.author, '刘基');
});
