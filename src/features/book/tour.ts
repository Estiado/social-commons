import { TOUR_STEPS, type TourStep } from '@/features/onboarding/steps';
import { BOOK_CHAPTERS } from './chapters';

const chapterDescriptions: Record<string, string> = {
  daily: '日新从一个概念出发。搜索关键词、选择分类，再从篇目预览进入正文。',
  events: '群鉴按历史事件组织。打开词条后，可以比较不同著述中的视角，并核对出处。',
  quotes: '撷英收录诗文与名句。按作者查找作品，再连着读选段与有出处的解读。',
  essay: '议论文素材从概念出发，提供站方示例。“查看完整目录与工具”保留个人词条、标签和材料管理。',
  guanlan: '观澜围绕具体事件组织事实、背景、不同立意与研究资料。分类可帮助你选定主题。',
  world: '知天下沿时间整理长期事件。进入正文后，可以按目录与时间节点定位，也可以连续阅读。',
};

const contents: TourStep = {
  id: 'book-contents',
  path: '/',
  target: 'book-contents',
  chapter: '认识这本书',
  title: '从六章目录开始',
  description:
    '选择一个章节，先浏览篇目，再翻入正文。正文可以自然滑动；顶部搜索与阅读空间随时可用。',
};
const chapters: TourStep[] = BOOK_CHAPTERS.map((chapter) => ({
  id: 'book-' + chapter.id,
  path: chapter.path,
  target: 'book-index-controls',
  chapter: '浏览篇目',
  title: chapter.label,
  description: chapterDescriptions[chapter.id],
}));
const shared = (id: string) => TOUR_STEPS.find((step) => step.id === id)!;
const saveText = { ...shared('save-text'), nextLabel: '打开阅读空间' };
const search: TourStep = {
  id: 'book-search',
  path: '/',
  target: 'nav-search',
  chapter: '找回内容',
  title: '全站搜索就在这里',
  description:
    '搜索概念、诗文、历史事件与主题。电脑也可以按 Ctrl / Command + K。私人正文在阅读空间内搜索。',
};
const briefing: TourStep = {
  id: 'book-briefing',
  path: '/',
  target: 'book-briefing',
  chapter: '每日阅读',
  title: '随时打开今日简报',
  description:
    '今日简报按北京时间更新，可以从页脚主动打开，也能保存为自己的阅读文稿。预览版首次进入不会自动弹出。',
};
const feedback: TourStep = {
  ...shared('feedback-form'),
  description: '预览版可以填写并保留草稿。实际反馈请使用正式站；预览版不向正式服务发送内容。',
};

export const BOOK_TOUR_ROUTES = {
  quick: [
    contents,
    chapters[1],
    shared('history-reader'),
    saveText,
    shared('workspace'),
    chapters[3],
    search,
    feedback,
  ],
  full: [
    contents,
    ...chapters,
    shared('history-reader'),
    saveText,
    shared('workspace'),
    shared('workspace-search'),
    shared('workspace-select'),
    shared('workspace-backup'),
    search,
    briefing,
    feedback,
  ],
};
