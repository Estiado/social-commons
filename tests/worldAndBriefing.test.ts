import test from 'node:test';
import assert from 'node:assert/strict';
import { chinaDay, dayNumber, untilChinaMidnight } from '../src/features/briefing/calendar.ts';
import { briefingEdition } from '../src/features/briefing/edition.ts';
import { briefingDocument } from '../src/features/briefing/document.ts';
import { WORLD_STORIES } from '../src/data/world/catalogue.ts';
import { getWorldStory } from '../src/data/world/index.ts';
import { worldStoryBookmarks, worldStoryDocument } from '../src/features/world/storyDocument.ts';
import { getGuanlanEvent } from '../src/data/guanlan/index.ts';
import { guanlanEventDocument } from '../src/features/guanlan/eventDocument.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';
import { versionContentDocument } from '../src/features/reading/contentDocuments.ts';
import { SEARCH_INDEX } from '../src/data/searchIndex.ts';
import { searchDocuments } from '../src/lib/search.ts';

test('简报跨年及北京时间午夜换版，同一日稳定且连续日三类内容都不同', () => {
  assert.equal(chinaDay(new Date('2026-10-26T15:59:59.999Z')), '2026-10-26');
  assert.equal(chinaDay(new Date('2026-10-26T16:00:00Z')), '2026-10-27');
  assert.equal(chinaDay(new Date('2026-12-31T16:00:00Z')), '2027-01-01');
  assert.equal(untilChinaMidnight(new Date('2026-10-26T15:59:59Z')), 1050);
  for (const invalid of ['2026-02-30', '2026-2-3', 'not-a-date', '2026-13-01'])
    assert.throws(() => dayNumber(invalid));
  let previous = briefingEdition('2026-10-27');
  for (let index = 1; index <= 70; index++) {
    const day = new Date(Date.UTC(2026, 9, 27 + index)).toISOString().slice(0, 10);
    const next = briefingEdition(day);
    assert.deepEqual(next, briefingEdition(day));
    for (const kind of ['news', 'quote', 'concept'] as const)
      assert.notEqual(next[kind].id, previous[kind].id, day + ' ' + kind);
    assert.ok(next.news.date <= day);
    assert.ok(next.quote.text.includes('\n') && next.quote.sourceUrl);
    previous = next;
  }
});

test('五条长期事件以连贯长读为主，时间书签关联正文，引用可保存导出', async () => {
  assert.equal(WORLD_STORIES.length, 5);
  let nodes = 0;
  for (const summary of WORLD_STORIES) {
    const story = (await getWorldStory(summary.id))!;
    assert.ok(story.timeline.length >= 7);
    nodes += story.timeline.length;
    assert.equal(new Set(story.timeline.map((point) => point.id)).size, story.timeline.length);
    const sources = new Set(story.sources.map((source) => source.id));
    assert.ok(story.context.length >= 3 && story.questions.length >= 3);
    for (const section of [
      ...story.narrative,
      ...story.context,
      ...story.perspectives,
      ...story.questions,
    ]) {
      assert.ok(section.paragraphs.length && section.sourceIds.length);
      assert.ok(section.sourceIds.every((id) => sources.has(id)));
    }
    for (const excerpt of story.excerpts) {
      assert.ok(excerpt.text && excerpt.locator && sources.has(excerpt.sourceId));
    }
    assert.ok(story.sources.some((source) => /新华社|央视|国际在线/u.test(source.publication)));
    assert.ok(
      story.sources.some((source) =>
        story.id === 'france-protests-2026'
          ? new URL(source.url).hostname === 'www.enseignementsup-recherche.gouv.fr'
          : /联合国/u.test(source.publication),
      ),
    );
    assert.deepEqual(
      story.timeline.map((point) => point.date),
      story.timeline.map((point) => point.date).toSorted(),
    );
    for (const point of story.timeline) {
      assert.ok(point.date <= story.updatedAt);
      assert.ok(point.title.trim(), point.id);
      assert.ok(
        point.sourceIds.length > 0 && point.sourceIds.every((id) => sources.has(id)),
        point.id,
      );
    }
    for (const source of story.sources) {
      assert.match(source.url, /^https:\/\//u);
      assert.ok(source.title.length > 5);
    }
    const document = worldStoryDocument(story);
    const bookmarks = worldStoryBookmarks(story, document);
    assert.equal(bookmarks.length, story.timeline.length);
    assert.ok(
      bookmarks.every((bookmark) =>
        document.blocks.some((block) => block.id === bookmark.blockId && block.type === 'heading'),
      ),
    );
    assert.equal(
      story.narrative.flatMap((chapter) => chapter.timelineIds).length,
      story.timeline.length,
    );
    assert.ok(story.narrative.length >= 5);
    assert.ok(story.narrative.every((chapter) => chapter.paragraphs.length >= 3));
    const roundTrip = editorToDocument(documentToEditor(document), document, document.title);
    assert.deepEqual(
      roundTrip.blocks.flatMap((block) => ('text' in block ? [block.text] : [])),
      document.blocks.flatMap((block) => ('text' in block ? [block.text] : [])),
    );
    const changed = worldStoryDocument({
      ...story,
      latest: [...story.latest, '新资料只改变新快照。'],
    });
    assert.notEqual(
      (await versionContentDocument(document)).url,
      (await versionContentDocument(changed)).url,
    );
    assert.ok(
      searchDocuments(SEARCH_INDEX, summary.title).some(
        (item) => item.path === '/world/' + summary.id,
      ),
    );
  }
  assert.equal(nodes, 50);
  assert.equal(await getWorldStory('__proto__'), undefined);
  assert.equal(await getWorldStory('constructor'), undefined);
});

test('零基础读者能在正文中找到前因、组织区别与法国最新政策的时间边界', async () => {
  const ukraine = (await getWorldStory('ukraine'))!;
  const text = worldStoryDocument(ukraine)
    .blocks.flatMap((block) => ('text' in block ? [block.text] : []))
    .join('\n');
  for (const concept of [
    '1991年',
    '2013年11月21日',
    '亚努科维奇',
    '联系国协定',
    '欧盟与北约',
    '议会',
    '克里米亚',
    '顿巴斯',
  ])
    assert.ok(text.includes(concept), concept);
  const document = worldStoryDocument(ukraine);
  assert.ok(
    document.blocks.some(
      (block) => block.type === 'quote' && block.text === ukraine.excerpts[0].text,
    ),
  );
  assert.ok(text.includes('胡若愚') && text.includes('“肇始”部分'));
  const france = (await getWorldStory('france-protests-2026'))!;
  const franceText = worldStoryDocument(france)
    .blocks.flatMap((block) => ('text' in block ? [block.text] : []))
    .join('\n');
  for (const phrase of [
    '2026年9月中旬',
    '2026年10月26日',
    '2027年',
    '尚未来临',
    'Parcoursup',
    '局部宵禁',
    '和平',
  ])
    assert.ok(franceText.includes(phrase), phrase);
  assert.equal(france.timeline.at(-1)?.date, '2026-10-27');
  assert.ok(france.questions.some((question) => question.title.includes('2023')));
});

test('长读先完整解释经过，书签不重复生成摘要，数据保留时间与分母', async () => {
  const story = (await getWorldStory('red-sea-shipping'))!;
  const document = worldStoryDocument(story);
  const text = document.blocks.flatMap((block) => ('text' in block ? [block.text] : [])).join('\n');
  assert.ok(text.indexOf(story.narrative[0].title) < text.indexOf('最近进展'));
  assert.ok(!text.includes('这一节点的影响：'));
  for (const term of ['2024年', '2.2%', '5.9%', '吨海里', '有效运力', '2026年7月9日'])
    assert.ok(text.includes(term), term);
  const bookmarks = worldStoryBookmarks(story, document);
  assert.equal(
    bookmarks.find((item) => item.id === 'mecl2026')?.blockId,
    bookmarks.find((item) => item.id === 'return2026')?.blockId,
  );
  const broken = {
    ...story,
    narrative: story.narrative.map((chapter) => ({ ...chapter, timelineIds: [] })),
  };
  assert.throws(() => worldStoryBookmarks(broken, worldStoryDocument(broken)), /未关联时间书签/);
  const ukraine = (await getWorldStory('ukraine'))!;
  const ukraineText = ukraine.narrative.flatMap((chapter) => chapter.paragraphs).join('\n');
  for (const term of ['2025年12月31日', '5880亿美元', '1950亿美元', '2026年10月'])
    assert.ok(ukraineText.includes(term), term);
});

test('简报导出保留整篇诗文与题名链接；风险分析保留调查窗口和方法边界', async () => {
  const edition = briefingEdition('2026-10-27');
  const document = briefingDocument(edition);
  const text = document.blocks.flatMap((block) => ('text' in block ? [block.text] : [])).join('\n');
  assert.ok(text.includes(edition.quote.text.split(/\n\s*\n/u).at(-1)!));
  assert.ok(
    document.blocks.some(
      (block) =>
        'spans' in block &&
        block.spans?.some(
          (span) => span.href?.includes('/world/') || span.href?.includes('/guanlan/events/'),
        ),
    ),
  );
  const risk = (await getGuanlanEvent('global-risk-2026'))!;
  const riskText = guanlanEventDocument(risk)
    .blocks.flatMap((block) => ('text' in block ? [block.text] : []))
    .join('\n');
  for (const term of [
    '2026年2月19日至4月24日',
    '1300',
    '50.3%',
    '86%',
    '16位',
    '不是预测模型给出的客观概率',
  ])
    assert.ok(riskText.includes(term), term);
  assert.ok(riskText.includes('不能剪成“联合国预测2030年世界大战”'));
  assert.equal(risk.sources.length, 4);
});
