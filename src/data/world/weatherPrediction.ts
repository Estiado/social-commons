import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/world/weatherPrediction.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';

const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'weather-prediction')!,
  ...{
    intro: paragraphCopy('intro'),
    narrative: [
      {
        id: 'limits',
        timelineIds: ['lorenz', 'butterfly'],
        title: EDITORIAL['chapters.0.title'],
        paragraphs: paragraphCopy('chapters.0.paragraphs'),
        sourceIds: ['lorenz', 'mit'],
      },
      {
        id: 'ensemble',
        timelineIds: ['ensemble1992'],
        title: EDITORIAL['chapters.1.title'],
        paragraphs: paragraphCopy('chapters.1.paragraphs'),
        sourceIds: ['ensemble'],
      },
      {
        id: 'learning',
        timelineIds: ['pangu', 'graphcast'],
        title: EDITORIAL['chapters.2.title'],
        paragraphs: paragraphCopy('chapters.2.paragraphs'),
        sourceIds: ['xinhuaGraph', 'pangu'],
      },
      {
        id: 'probability',
        timelineIds: ['gencast'],
        title: EDITORIAL['chapters.3.title'],
        paragraphs: paragraphCopy('chapters.3.paragraphs'),
        sourceIds: ['gencast', 'xinhuaGen', 'scienceNews'],
      },
      {
        id: 'operations',
        timelineIds: ['aifsSingle', 'aifsEnsemble', 'aifsV2'],
        title: EDITORIAL['chapters.4.title'],
        paragraphs: paragraphCopy('chapters.4.paragraphs'),
        sourceIds: ['aifs', 'upgrade'],
      },
    ],
    context: [
      {
        title: EDITORIAL['context.0.title'],
        paragraphs: paragraphCopy('context.0.paragraphs'),
        sourceIds: ['pangu', 'aifs'],
      },
      {
        title: EDITORIAL['context.1.title'],
        paragraphs: paragraphCopy('context.1.paragraphs'),
        sourceIds: ['ensemble', 'gencast'],
      },
      {
        title: EDITORIAL['context.2.title'],
        paragraphs: paragraphCopy('context.2.paragraphs'),
        sourceIds: ['pangu', 'gencast', 'aifs'],
      },
    ],
    latest: paragraphCopy('latest'),
    excerpts: [
      {
        text: '提供可能情景的完整范围。',
        sourceId: 'aifs',
        locator:
          '2025年7月1日业务公告，AIFS ENS介绍段；原文“provide the full range of possible scenarios”，此处为中文翻译。',
      },
    ],
    terms: [
      {
        term: '数值天气预报',
        definition: EDITORIAL['terms.0'],
      },
      {
        term: '集合预报',
        definition: EDITORIAL['terms.1'],
      },
      {
        term: '再分析资料',
        definition: EDITORIAL['terms.2'],
      },
      {
        term: '确定性混沌',
        definition: EDITORIAL['terms.3'],
      },
      {
        term: '业务运行',
        definition: EDITORIAL['terms.4'],
      },
    ],
    timeline: [
      {
        id: 'lorenz',
        date: '1963-03-01',
        dateLabel: '1963年3月',
        title: EDITORIAL['time.0'],
        sourceIds: ['lorenz'],
      },
      {
        id: 'butterfly',
        date: '1972-12-31',
        dateLabel: '1972年报告',
        title: EDITORIAL['time.1'],
        sourceIds: ['mit'],
      },
      {
        id: 'ensemble1992',
        date: '1992-12-01',
        dateLabel: '1992年业务推出阶段',
        title: EDITORIAL['time.2'],
        sourceIds: ['ensemble'],
      },
      {
        id: 'pangu',
        date: '2023-07-05',
        dateLabel: '2023年7月5日',
        title: EDITORIAL['time.3'],
        sourceIds: ['pangu'],
      },
      {
        id: 'graphcast',
        date: '2023-11-14',
        dateLabel: '2023年11月14日论文；15日新华社报道',
        title: EDITORIAL['time.4'],
        sourceIds: ['xinhuaGraph'],
      },
      {
        id: 'gencast',
        date: '2024-12-04',
        dateLabel: '2024年12月4日',
        title: EDITORIAL['time.5'],
        sourceIds: ['gencast', 'xinhuaGen'],
      },
      {
        id: 'aifsSingle',
        date: '2025-02-25',
        dateLabel: '2025年2月25日',
        title: EDITORIAL['time.6'],
        sourceIds: ['aifs'],
      },
      {
        id: 'aifsEnsemble',
        date: '2025-07-01',
        dateLabel: '2025年7月1日',
        title: EDITORIAL['time.7'],
        sourceIds: ['aifs'],
      },
      {
        id: 'aifsV2',
        date: '2026-05-12',
        dateLabel: '2026年5月12日',
        title: EDITORIAL['time.8'],
        sourceIds: ['upgrade'],
      },
    ],
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: paragraphCopy('perspectives.0.paragraphs'),
        sourceIds: ['pangu', 'gencast'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: paragraphCopy('perspectives.1.paragraphs'),
        sourceIds: ['aifs', 'upgrade'],
      },
    ],
    questions: [
      {
        title: EDITORIAL['questions.0.title'],
        paragraphs: paragraphCopy('questions.0.paragraphs'),
        sourceIds: ['ensemble'],
      },
      {
        title: EDITORIAL['questions.1.title'],
        paragraphs: paragraphCopy('questions.1.paragraphs'),
        sourceIds: ['ensemble', 'gencast'],
      },
      {
        title: EDITORIAL['questions.2.title'],
        paragraphs: paragraphCopy('questions.2.paragraphs'),
        sourceIds: ['pangu', 'aifs'],
      },
    ],
    watch: paragraphCopy('watch'),
    relatedEventIds: ['global-risk-2026'],
    sources: [
      {
        id: 'lorenz',
        title: 'Deterministic Nonperiodic Flow',
        publication: 'Journal of the Atmospheric Sciences',
        author: 'Edward N. Lorenz',
        date: '1963-03-01',
        url: 'https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2',
      },
      {
        id: 'mit',
        title: 'Edward Lorenz, father of chaos theory and butterfly effect, dies at 90',
        publication: 'MIT News',
        date: '2008-04-16',
        url: 'https://news.mit.edu/2008/obit-lorenz-0416',
      },
      {
        id: 'ensemble',
        title: '30 years of ensemble forecasting at ECMWF',
        publication: 'ECMWF',
        date: '2022年回顾',
        url: 'https://www.ecmwf.int/en/about/media-centre/focus/2022/30-years-ensemble-forecasting-ecmwf',
      },
      {
        id: 'pangu',
        title: 'Accurate medium-range global weather forecasting with 3D neural networks',
        publication: 'Nature 619，533–538',
        author: 'Kaifeng Bi、Lingxi Xie等',
        date: '2023-07-05',
        url: 'https://www.nature.com/articles/s41586-023-06185-3',
      },
      {
        id: 'xinhuaGraph',
        title: '谷歌下属团队研发人工智能模型预测中期天气',
        publication: '新华社',
        author: '葛晨',
        date: '2023-11-15',
        url: 'https://www.news.cn/2023-11/15/c_1129977518.htm',
      },
      {
        id: 'gencast',
        title: 'Probabilistic weather forecasting with machine learning',
        publication: 'Nature',
        author: 'Ilan Price等',
        date: '2024-12-04',
        url: 'https://doi.org/10.1038/s41586-024-08252-9',
      },
      {
        id: 'xinhuaGen',
        title: '研究显示谷歌人工智能模型预报天气更快、更准确',
        publication: '新华社',
        date: '2024-12-05',
        url: 'https://www.news.cn/20241205/d6bff3d9c9744bfcb7d09f6f81a5eb69/c.html',
      },
      {
        id: 'scienceNews',
        title: '谷歌AI模型超越现有天气预报',
        publication: '中国科学报',
        author: '冯维维',
        date: '2024-12-06',
        url: 'https://news.sciencenet.cn/htmlnews/2024/12/535349.shtm',
      },
      {
        id: 'aifs',
        title: 'ECMWF’s ensemble AI forecasts become operational',
        publication: 'ECMWF',
        date: '2025-07-01',
        url: 'https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational',
      },
      {
        id: 'upgrade',
        title: 'Significant update to ECMWF’s key forecasting systems IFS and AIFS goes live',
        publication: 'ECMWF',
        date: '2026-05-12',
        url: 'https://www.ecmwf.int/en/about/media-centre/news/2026/ifs-cycle-50r1-aifsv2-live',
      },
    ],
  },
};
export default story;
