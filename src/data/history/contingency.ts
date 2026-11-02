import { EDITORIAL } from '../../../.artifacts/editorial/history/contingency.ts';
import type { IEvent } from '../types';

export const CONTINGENCY_EVENTS: IEvent[] = [
  {
    id: 'lorenz-predictability',
    title: EDITORIAL['heading.0'],
    date: '1963年论文；1972年蝴蝶效应报告',
    location: '美国麻省理工学院；数值天气预报研究',
    category: '科学与自然',
    summary: EDITORIAL['lorenz.summary'],
    summarySources: [
      {
        title: '洛伦兹1963年原论文出版页',
        url: 'https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2',
      },
      {
        title: 'MIT对洛伦兹研究的回顾',
        url: 'https://news.mit.edu/2008/obit-lorenz-0416',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: 'ECMWF：集合预报三十年',
        url: 'https://www.ecmwf.int/en/about/media-centre/focus/2022/30-years-ensemble-forecasting-ecmwf',
      },
    ],
    perspectives: [
      {
        id: 'lorenz-model',
        role: '气象学家爱德华·洛伦兹',
        title: EDITORIAL['heading.1'],
        description: EDITORIAL['lorenz-model.description'],
        quote: '确定性的常微分方程。',
        original: 'deterministic ordinary nonlinear differential equations',
        translated: true,
        source:
          'Edward N. Lorenz：Deterministic Nonperiodic Flow，Journal of the Atmospheric Sciences 20(2)，1963，130–141页',
        sourceUrl: 'https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2',
        locator: '论文摘要首句',
        sourceType: '史料记载',
        readingId: 'lorenz-paper',
      },
      {
        id: 'lorenz-metaphor',
        role: '麻省理工学院研究回顾',
        title: EDITORIAL['heading.2'],
        description: EDITORIAL['lorenz-metaphor.description'],
        quote: '微小差异。',
        original: 'small differences in a dynamic system',
        translated: true,
        source:
          'MIT News：Edward Lorenz, father of chaos theory and butterfly effect, dies at 90，2008-04-16',
        sourceUrl: 'https://news.mit.edu/2008/obit-lorenz-0416',
        locator: '正文第2—3段，早期模拟与1972年报告题名',
        sourceType: '后世研究',
      },
      {
        id: 'lorenz-ensemble',
        role: 'ECMWF的后续预报实践',
        title: EDITORIAL['heading.3'],
        description: EDITORIAL['lorenz-ensemble.description'],
        quote: '初始条件和预报模型中的不确定性。',
        original: 'uncertainties in the initial conditions and forecast model',
        translated: true,
        source: 'ECMWF：30 years of ensemble forecasting at ECMWF，2022，1990s段',
        sourceUrl:
          'https://www.ecmwf.int/en/about/media-centre/focus/2022/30-years-ensemble-forecasting-ecmwf',
        locator: '1990s – ensemble forecasts go live及起始问题说明',
        sourceType: '后世研究',
      },
    ],
  },
  {
    id: 'penicillin-discovery',
    title: EDITORIAL['heading.4'],
    date: '1928年观察；1939—1940年代开发；1945年共同获奖',
    location: '英国伦敦、牛津；美国的生产研究',
    category: '科学与自然',
    summary: EDITORIAL['penicillin.summary'],
    summarySources: [
      {
        title: '美国化学会：青霉素的发现与开发',
        url: 'https://www.acs.org/education/whatischemistry/landmarks/flemingpenicillin.html',
      },
      {
        title: '苏格兰国家博物馆：培养容器与开发过程',
        url: 'https://www.nms.ac.uk/discover-catalogue/how-a-ceramic-object-fueled-a-medical-breakthrough',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: '弗洛里1945年诺贝尔演讲原件',
        url: 'https://www.nobelprize.org/uploads/2018/06/florey-lecture.pdf',
      },
    ],
    perspectives: [
      {
        id: 'penicillin-development',
        role: '美国化学会科学史项目',
        title: EDITORIAL['heading.5'],
        description: EDITORIAL['penicillin-development.description'],
        quote: '从实验室里的奇异现象变成救命药物。',
        original: 'from a laboratory curiosity into a life-saving drug',
        translated: true,
        source:
          'American Chemical Society：Discovery and Development of Penicillin，Penicillin Research at Oxford University',
        sourceUrl: 'https://www.acs.org/education/whatischemistry/landmarks/flemingpenicillin.html',
        locator: 'Penicillin Research at Oxford University首段',
        sourceType: '后世研究',
      },
      {
        id: 'penicillin-vessel',
        role: '苏格兰国家博物馆的器物史',
        title: EDITORIAL['heading.6'],
        description: EDITORIAL['penicillin-vessel.description'],
        quote: '培养容器，1940年，由诺曼·乔治·希特利博士设计。',
        original: 'Culture vessel, 1940, designed by Dr Norman George Heatley',
        translated: true,
        source: 'National Museums Scotland：How a ceramic object fueled a medical breakthrough',
        sourceUrl:
          'https://www.nms.ac.uk/discover-catalogue/how-a-ceramic-object-fueled-a-medical-breakthrough',
        locator: '图片说明Culture vessel, 1940',
        sourceType: '后世研究',
      },
      {
        id: 'penicillin-credit',
        role: '1945年诺贝尔奖授奖记录',
        title: EDITORIAL['heading.7'],
        description: EDITORIAL['penicillin-credit.description'],
        quote: '发现青霉素及其对多种感染性疾病的疗效。',
        original:
          'for the discovery of penicillin and its curative effect in various infectious diseases',
        translated: true,
        source: 'The Nobel Prize in Physiology or Medicine 1945，授奖说明',
        sourceUrl: 'https://www.nobelprize.org/prizes/medicine/1945/summary/',
        locator: '页面授奖理由',
        sourceType: '后世研究',
      },
    ],
  },
];
