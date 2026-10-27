import { EDITORIAL } from '../../../.artifacts/editorial/world/catalogue.ts';
import type { WorldStorySummary } from './types';
export const WORLD_STORIES: WorldStorySummary[] = [
  {
    id: 'ukraine',
    title: EDITORIAL['0.title'],
    summary: EDITORIAL['0.summary'],
    category: '冲突与和平',
    period: '2014年至今',
    updatedAt: '2026-10-27',
    latestEventDate: '2026-10-25',
    keywords: ['俄乌', '乌克兰', '俄罗斯', '明斯克', '黑海', '停火', '安全保障'],
  },
  {
    id: 'palestine',
    title: EDITORIAL['1.title'],
    summary: EDITORIAL['1.summary'],
    category: '冲突与和平',
    period: '1947年至今',
    updatedAt: '2026-10-27',
    latestEventDate: '2026-10-15',
    keywords: ['巴以', '巴勒斯坦', '以色列', '加沙', '两国方案', '人道援助', '奥斯陆'],
  },
  {
    id: 'un-2030',
    title: EDITORIAL['2.title'],
    summary: EDITORIAL['2.summary'],
    category: '全球行动',
    period: '2000年至2030年',
    updatedAt: '2026-10-27',
    latestEventDate: '2026-09-15',
    keywords: ['联合国', '2030', 'SDG', '可持续发展', '全球行动', '融资', '风险报告'],
  },
];
