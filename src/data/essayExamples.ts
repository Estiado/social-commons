import { EDITORIAL } from '../../.artifacts/editorial/essayExamples.ts';
import type { MaterialFields } from '../features/essay/materials';
import { REASONING_EXAMPLES } from './essay/reasoningExamples.ts';
import { SOCIAL_EXAMPLES } from './essay/socialEvidence.ts';
import { LEARNING_EXAMPLES } from './essay/learningAndCulture.ts';
import { YOUTH_EXAMPLES } from './essay/youthStudies.ts';

export interface EssayExample extends MaterialFields {
  id: string;
  conceptId: string;
}

// Site examples are source-based summaries, not unattributed copied passages.
// The same reviewed data can seed Supabase; visitors cannot edit these entries.
export const ESSAY_EXAMPLES: EssayExample[] = [
  ...YOUTH_EXAMPLES,
  ...LEARNING_EXAMPLES,
  ...SOCIAL_EXAMPLES,
  ...REASONING_EXAMPLES,
  {
    id: 'example-thucydides',
    conceptId: 'e1',
    title: '“修昔底德陷阱”是一种研究视角，不是战争预言',
    content: EDITORIAL['ESSAY_EXAMPLES.example-thucydides.content'],
    source: '本站依据 Harvard Kennedy School Belfer Center 的 Thucydides’s Trap 项目介绍整理。',
    sourceUrl: 'https://www.belfercenter.org/programs/thucydidess-trap',
    usageHint: EDITORIAL['ESSAY_EXAMPLES.example-thucydides.usageHint'],
  },
  {
    id: 'example-lemons',
    conceptId: 'e2',
    title: '二手车市场为什么会出现“逆向选择”？',
    content: EDITORIAL['ESSAY_EXAMPLES.example-lemons.content'],
    source: '本站依据 NobelPrize.org 的 2001 年经济学奖新闻稿整理。',
    sourceUrl: 'https://www.nobelprize.org/prizes/economic-sciences/2001/press-release/',
    usageHint: EDITORIAL['ESSAY_EXAMPLES.example-lemons.usageHint'],
  },
];
