import { EDITORIAL } from '../../../.artifacts/editorial/world/france.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';
const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'france-protests-2026')!,
  ...{
    intro: [EDITORIAL['intro.0'], EDITORIAL['intro.1']],
    context: [
      {
        title: EDITORIAL['context.0.title'],
        paragraphs: [EDITORIAL['context.0.paragraphs.0'], EDITORIAL['context.0.paragraphs.1']],
        sourceIds: ['xinhua-analysis', 'reuters-schools'],
      },
      {
        title: EDITORIAL['context.1.title'],
        paragraphs: [EDITORIAL['context.1.paragraphs.0'], EDITORIAL['context.1.paragraphs.1']],
        sourceIds: ['xinhua-analysis', 'ap-protest', 'lemonde-followup'],
      },
      {
        title: EDITORIAL['context.2.title'],
        paragraphs: [EDITORIAL['context.2.paragraphs.0'], EDITORIAL['context.2.paragraphs.1']],
        sourceIds: ['xinhua-curfew', 'ap-court', 'reuters-schools'],
      },
    ],
    excerpts: [
      {
        text: '问题长期存在，不满情绪才会爆发。',
        sourceId: 'xinhua-analysis',
        locator:
          '法比安·张，孙毅《国际观察｜法国社会动荡背后的现实矛盾和深层困境》所引发言，新华社，2026年10月19日，“教育问题”部分，节引。',
      },
    ],
    latest: [EDITORIAL['latest.0'], EDITORIAL['latest.1']],
    terms: [
      {
        term: EDITORIAL['terms.0.term'],
        definition: EDITORIAL['terms.0.definition'],
      },
      {
        term: EDITORIAL['terms.1.term'],
        definition: EDITORIAL['terms.1.definition'],
      },
      {
        term: EDITORIAL['terms.2.term'],
        definition: EDITORIAL['terms.2.definition'],
      },
      {
        term: EDITORIAL['terms.3.term'],
        definition: EDITORIAL['terms.3.definition'],
      },
      {
        term: EDITORIAL['terms.4.term'],
        definition: EDITORIAL['terms.4.definition'],
      },
    ],
    timeline: [
      {
        id: 'school-start',
        date: '2026-09-15',
        dateLabel: '2026年9月中旬',
        title: EDITORIAL['timeline.0.title'],
        what: [EDITORIAL['timeline.0.what.0']],
        why: EDITORIAL['timeline.0.why'],
        sourceIds: ['xinhua-analysis', 'reuters-schools'],
      },
      {
        id: 'october8',
        date: '2026-10-08',
        dateLabel: '2026年10月8日',
        title: EDITORIAL['timeline.1.title'],
        what: [EDITORIAL['timeline.1.what.0']],
        why: EDITORIAL['timeline.1.why'],
        sourceIds: ['reuters-schools'],
      },
      {
        id: 'october17',
        date: '2026-10-17',
        dateLabel: '2026年10月17日',
        title: EDITORIAL['timeline.2.title'],
        what: [EDITORIAL['timeline.2.what.0'], EDITORIAL['timeline.2.what.1']],
        why: EDITORIAL['timeline.2.why'],
        sourceIds: ['xinhua-protests'],
      },
      {
        id: 'october18',
        date: '2026-10-18',
        dateLabel: '2026年10月18日',
        title: EDITORIAL['timeline.3.title'],
        what: [EDITORIAL['timeline.3.what.0']],
        why: EDITORIAL['timeline.3.why'],
        sourceIds: ['xinhua-analysis'],
      },
      {
        id: 'october19',
        date: '2026-10-19',
        dateLabel: '2026年10月19日至20日',
        title: EDITORIAL['timeline.4.title'],
        what: [EDITORIAL['timeline.4.what.0']],
        why: EDITORIAL['timeline.4.why'],
        sourceIds: ['xinhua-curfew'],
      },
      {
        id: 'october22',
        date: '2026-10-22',
        dateLabel: '2026年10月22日',
        title: EDITORIAL['timeline.5.title'],
        what: [EDITORIAL['timeline.5.what.0']],
        why: EDITORIAL['timeline.5.why'],
        sourceIds: ['ap-court'],
      },
      {
        id: 'october24',
        date: '2026-10-24',
        dateLabel: '2026年10月24日',
        title: EDITORIAL['timeline.6.title'],
        what: [EDITORIAL['timeline.6.what.0']],
        why: EDITORIAL['timeline.6.why'],
        sourceIds: ['ap-protest', 'reuters-oct24'],
      },
      {
        id: 'october26',
        date: '2026-10-26',
        dateLabel: '2026年10月26日',
        title: EDITORIAL['timeline.7.title'],
        what: [EDITORIAL['timeline.7.what.0']],
        why: EDITORIAL['timeline.7.why'],
        sourceIds: ['education-response', 'lemonde-plan'],
      },
    ],
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: [
          EDITORIAL['perspectives.0.paragraphs.0'],
          EDITORIAL['perspectives.0.paragraphs.1'],
        ],
        sourceIds: ['xinhua-analysis'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: [
          EDITORIAL['perspectives.1.paragraphs.0'],
          EDITORIAL['perspectives.1.paragraphs.1'],
        ],
        sourceIds: ['reuters-schools'],
      },
      {
        title: EDITORIAL['perspectives.2.title'],
        paragraphs: [
          EDITORIAL['perspectives.2.paragraphs.0'],
          EDITORIAL['perspectives.2.paragraphs.1'],
        ],
        sourceIds: ['ap-court', 'ap-protest', 'lemonde-plan'],
      },
    ],
    questions: [
      {
        title: EDITORIAL['questions.0.title'],
        paragraphs: [EDITORIAL['questions.0.paragraphs.0']],
        sourceIds: ['xinhua-analysis', 'reuters-schools', 'previous-2023'],
      },
      {
        title: EDITORIAL['questions.1.title'],
        paragraphs: [EDITORIAL['questions.1.paragraphs.0']],
        sourceIds: ['xinhua-protests', 'ap-protest'],
      },
      {
        title: EDITORIAL['questions.2.title'],
        paragraphs: [EDITORIAL['questions.2.paragraphs.0']],
        sourceIds: ['education-response', 'lemonde-plan'],
      },
    ],
    watch: [EDITORIAL['watch.0'], EDITORIAL['watch.1'], EDITORIAL['watch.2']],
    sources: [
      {
        id: 'xinhua-analysis',
        title: '国际观察｜法国社会动荡背后的现实矛盾和深层困境',
        publication: '新华社',
        date: '2026-10-19',
        url: 'https://www3.xinhuanet.com/world/20261019/be40ca8e958b464cb09b6cf2b7abe1c3/c.html',
        author: '孙毅',
      },
      {
        id: 'xinhua-protests',
        title: '法国多地发生大规模抗议 数百人被捕',
        publication: '新华社',
        date: '2026-10-18',
        url: 'https://www1.xinhuanet.com/world/20261018/26bd823cc7d04994b5e5b1bfa49edf9a/c.html',
        author: '孙毅',
      },
      {
        id: 'xinhua-curfew',
        title: '法国多城实施局部宵禁防止骚乱重演',
        publication: '新华社',
        date: '2026-10-20',
        url: 'https://www.xinhuanet.com/20261020/1d40c941682043448724c71bd02e3135/c.html',
        author: '乔本孝',
      },
      {
        id: 'reuters-schools',
        title: 'French students keep up protest pressure with some demonstrations hit by violence',
        publication: 'Reuters · Investing.com刊载',
        date: '2026-10-08',
        url: 'https://www.investing.com/news/economy-news/french-teens-march-for-decent-schools-despite-governments-pledge-to-act-4938931',
        author: 'Manon Cruz、Dominique Vidalon',
      },
      {
        id: 'ap-court',
        title:
          'Thousands gather in Paris after a court lifts a protest ban despite fears of new violence',
        publication: 'Associated Press',
        date: '2026-10-22',
        url: 'https://apnews.com/article/cc47cffe54c65934dd7920bc3847c9ae',
      },
      {
        id: 'ap-protest',
        title:
          'Police and protesters clash in Paris as an estimated 410,000 demonstrate across France',
        publication: 'Associated Press',
        date: '2026-10-24',
        url: 'https://apnews.com/article/france-protests-paris-unrest-ad2fb9206e72e5d1b4ae43fdf7aa96a9',
      },
      {
        id: 'reuters-oct24',
        title: 'Violence flares in Paris after largely peaceful protests across France',
        publication: 'Reuters · Investing.com刊载',
        date: '2026-10-24',
        url: 'https://www.investing.com/news/world-news/france-mounts-huge-security-operation-to-prevent-protest-violence-4970771',
      },
      {
        id: 'lemonde-followup',
        title: 'After October 24 protests, French government braces for long fall of unrest',
        publication: 'Le Monde',
        date: '2026-10-26',
        url: 'https://www.lemonde.fr/en/politics/article/2026/10/26/after-october-24-protests-french-government-braces-for-long-fall-of-unrest_6764683_5.html',
        author: 'Mariama Darame',
      },
      {
        id: 'lemonde-plan',
        title: 'French government announces measures to address student protests',
        publication: 'Le Monde',
        date: '2026-10-27',
        url: 'https://www.lemonde.fr/en/france/article/2026/10/27/french-government-announces-measures-to-address-student-protests_6765310_7.html',
      },
      {
        id: 'education-response',
        title: '法国教育与高教部门：面向青年群体的教育措施说明',
        publication: '法国高等教育与研究部',
        date: '2026-10-26',
        url: 'https://www.enseignementsup-recherche.gouv.fr/fr/remplacement-de-la-plateforme-parcoursup-plafonnement-du-nombre-d-eleves-par-classe-etat-des-104451',
      },
      {
        id: 'previous-2023',
        title: '警方枪击17岁少年后的抗议：2023年原始报道（日文）',
        publication: 'AFP · AFPBB News',
        date: '2023-06-28',
        url: 'https://www.afpbb.com/articles/-/3470207',
      },
    ],
    relatedEventIds: ['global-risk-2026'],
  },
};
export default story;
