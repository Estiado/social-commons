import type { WorldStory } from '../../data/world/types.ts';
import type { TextBlock } from '../reading/model.ts';
import { createContentDocument, contentUrl } from '../reading/contentDocuments.ts';
import { referenceParagraph } from '../reading/references.ts';

type Block = Omit<TextBlock, 'id'>;
const p = (text: string): Block => ({ type: 'paragraph', text });
const h = (text: string, level = 2): Block => ({ type: 'heading', text, level });

/** One canonical sequence serves timelines, annotations, writing and both exports. */
export function worldStoryDocument(story: WorldStory) {
  const sources = new Map(story.sources.map((source) => [source.id, source]));
  const cite = (ids: string[]) =>
    ids.map((id) => {
      const source = sources.get(id);
      if (!source) throw new Error(`知天下 ${story.id} 缺少出处 ${id}`);
      return referenceParagraph(
        source.title,
        source.url,
        [source.author, source.publication, source.date].filter(Boolean).join(' · ') + ' · ',
      );
    });
  return createContentDocument(
    story.title + ' · 事件脉络',
    '社科通识 · 知天下',
    contentUrl('world', story.id),
    [
      p('社科通识编辑 · 资料核对至 ' + story.updatedAt),
      h('先了解这件事'),
      ...story.intro.map(p),
      h('前因与参与者'),
      ...story.context.flatMap((part) => [
        h(part.title, 3),
        ...part.paragraphs.map(p),
        ...cite(part.sourceIds),
      ]),
      h('从原文读起'),
      ...story.excerpts.flatMap((excerpt) => [
        { type: 'quote' as const, text: excerpt.text },
        p(excerpt.locator),
        ...cite([excerpt.sourceId]),
      ]),
      h('最近进展'),
      ...story.latest.map(p),
      ...cite(story.timeline.at(-1)?.sourceIds || []),
      h('读懂关键词'),
      ...story.terms.flatMap((term) => [h(term.term, 3), p(term.definition)]),
      h('时间脉络'),
      ...story.timeline.flatMap((point) => [
        h(point.dateLabel + ' · ' + point.title, 3),
        ...point.what.map(p),
        p('这一节点的影响：' + point.why),
        ...cite(point.sourceIds),
      ]),
      h('不同视角'),
      ...story.perspectives.flatMap((view) => [
        h(view.title, 3),
        ...view.paragraphs.map(p),
        ...cite(view.sourceIds),
      ]),
      h('把几个问题讲清楚'),
      ...story.questions.flatMap((question) => [
        h(question.title, 3),
        ...question.paragraphs.map(p),
        ...cite(question.sourceIds),
      ]),
      h('接下来关注什么'),
      ...story.watch.map(p),
      h('资料来源'),
      ...story.sources.flatMap((source) => [
        p([source.author, source.publication, source.date].filter(Boolean).join(' · ')),
        referenceParagraph(source.title, source.url),
      ]),
    ],
    '社科通识编辑',
    story.keywords,
  );
}
