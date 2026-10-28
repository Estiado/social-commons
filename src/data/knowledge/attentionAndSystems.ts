import { EDITORIAL } from '../../../.artifacts/editorial/knowledge/attentionAndSystems.ts';
import type { IDailyKnowledge, IResearchSource } from '../types';
import { researchCitation } from './youthStudies.ts';
interface Study {
  id: string;
  conceptId: string;
  concept: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  topics: string[];
  researchSource: IResearchSource;
}
export const ATTENTION_STUDIES: Study[] = [
  {
    id: 'd133',
    conceptId: 'e103',
    concept: '注意力残留',
    category: '组织心理学 · 注意力',
    title: EDITORIAL['d133.title'],
    topics: ['任务切换', '专注', '时间安排'],
    researchSource: {
      title:
        'Why is it so hard to do my work? The challenge of attention residue when switching between work tasks',
      authors: ['Sophie Leroy'],
      journal: 'Organizational Behavior and Human Decision Processes',
      year: 2009,
      volume: 109,
      issue: '2',
      pages: '168–181',
      url: 'https://doi.org/10.1016/j.obhdp.2009.04.002',
    },
    summary: EDITORIAL['d133.summary'],
    content: EDITORIAL['d133.content'],
  },
  {
    id: 'd134',
    conceptId: 'e104',
    concept: '生成效应',
    category: '认知心理学 · 学习',
    topics: ['主动学习', '理解与记忆', 'AI辅助'],
    title: EDITORIAL['d134.title'],
    researchSource: {
      title: 'The generation effect: Delineation of a phenomenon',
      authors: ['Norman J. Slamecka', 'Peter Graf'],
      journal: 'Journal of Experimental Psychology: Human Learning and Memory',
      year: 1978,
      volume: 4,
      issue: '6',
      pages: '592–604',
      url: 'https://doi.org/10.1037/0278-7393.4.6.592',
      fullTextUrl: 'https://garfield.library.upenn.edu/classics1992/A1992HQ13900001.pdf',
    },
    summary: EDITORIAL['d134.summary'],
    content: EDITORIAL['d134.content'],
  },
  {
    id: 'd135',
    conceptId: 'e105',
    concept: '认知流畅性',
    category: '认知心理学 · 判断',
    topics: ['信息判断', '表达与真实', '熟悉感'],
    title: EDITORIAL['d135.title'],
    researchSource: {
      title: 'Uniting the Tribes of Fluency to Form a Metacognitive Nation',
      authors: ['Adam L. Alter', 'Daniel M. Oppenheimer'],
      journal: 'Personality and Social Psychology Review',
      year: 2009,
      volume: 13,
      issue: '3',
      pages: '219–235',
      url: 'https://doi.org/10.1177/1088868309341564',
    },
    summary: EDITORIAL['d135.summary'],
    content: EDITORIAL['d135.content'],
  },
  {
    id: 'd136',
    conceptId: 'e106',
    concept: '自动化的误用与弃用',
    category: '组织心理学 · 人机协作',
    topics: ['信任', '自动化', '责任与设计'],
    title: EDITORIAL['d136.title'],
    researchSource: {
      title: 'Humans and Automation: Use, Misuse, Disuse, Abuse',
      authors: ['Raja Parasuraman', 'Victor Riley'],
      journal: 'Human Factors',
      year: 1997,
      volume: 39,
      issue: '2',
      pages: '230–253',
      url: 'https://doi.org/10.1518/001872097778543886',
      fullTextUrl: 'https://web.mit.edu/16.459/www/parasuraman.pdf',
    },
    summary: EDITORIAL['d136.summary'],
    content: EDITORIAL['d136.content'],
  },
  {
    id: 'd137',
    conceptId: 'e107',
    concept: '科学中的马太效应',
    category: '社会学 · 科学与评价',
    topics: ['声望', '机会分配', '累积优势'],
    title: EDITORIAL['d137.title'],
    researchSource: {
      title: 'The Matthew Effect in Science',
      authors: ['Robert K. Merton'],
      journal: 'Science',
      year: 1968,
      volume: 159,
      issue: '3810',
      pages: '56–63',
      url: 'https://doi.org/10.1126/science.159.3810.56',
      fullTextUrl: 'https://garfield.library.upenn.edu/merton/matthew1.pdf',
    },
    summary: EDITORIAL['d137.summary'],
    content: EDITORIAL['d137.content'],
  },
  {
    id: 'd138',
    conceptId: 'e108',
    concept: '文化资本的三种形态',
    category: '社会学 · 教育',
    topics: ['教育机会', '家庭背景', '能力评价'],
    title: EDITORIAL['d138.title'],
    researchSource: {
      title: 'The Forms of Capital',
      authors: ['Pierre Bourdieu'],
      journal:
        'Handbook of Theory and Research for the Sociology of Education，J. G. Richardson编，Greenwood Press',
      year: 1986,
      issue: '书章',
      pages: '241–258',
      url: 'https://www.mom.arq.ufmg.br/mom/02_babel/textos/bourdieu-forms-of-capital.pdf',
    },
    summary: EDITORIAL['d138.summary'],
    content: EDITORIAL['d138.content'],
  },
  {
    id: 'd139',
    conceptId: 'e109',
    concept: '计划谬误',
    category: '行为经济学 · 时间判断',
    topics: ['时间管理', '预测与经验', '项目协作'],
    title: EDITORIAL['d139.title'],
    researchSource: {
      title:
        'Exploring the “planning fallacy”: Why people underestimate their task completion times',
      authors: ['Roger Buehler', 'Dale Griffin', 'Michael Ross'],
      journal: 'Journal of Personality and Social Psychology',
      year: 1994,
      volume: 67,
      issue: '3',
      pages: '366–381',
      url: 'https://doi.org/10.1037/0022-3514.67.3.366',
      fullTextUrl:
        'https://web.mit.edu/curhan/www/docs/Articles/biases/67_J_Personality_and_Social_Psychology_366,_1994.pdf',
    },
    summary: EDITORIAL['d139.summary'],
    content: EDITORIAL['d139.content'],
  },
];
export const ATTENTION_KNOWLEDGE: IDailyKnowledge[] = ATTENTION_STUDIES.map((item) => ({
  id: item.id,
  date: '2026-10-28',
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: researchCitation(item.researchSource),
  researchSource: item.researchSource,
}));
