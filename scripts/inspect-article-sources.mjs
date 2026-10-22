import { readFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio/slim';

// Developer diagnostic: local downloaded HTML stays in ignored .artifacts/.
for (const name of await readdir('.artifacts/source-checks')) {
  if (!name.endsWith('.html')) continue;
  const $ = load(await readFile(`.artifacts/source-checks/${name}`, 'utf8'));
  const containers = ['#zoom', '#ozoom', '.rm_txt_con', '.box_con', '.news_txt', '.index_cententWrap__Jv8jK', '[class*="cententWrap"]', '.article-content', '.articleContent', '#content', '#article-content', '.content', 'article', '.articleBody', '[class*="content-body"]', '[class*="contentBody"]'];
  console.log(JSON.stringify({ name, title: $('title').text(),
    byline: $('h1').first().parent().text().trim().slice(0, 400),
    headingSiblings: $('h1').first().nextAll().toArray().slice(0, 5).map((node) => ({ tag: node.tagName, class: $(node).attr('class'), text: $(node).text().trim().slice(0, 140) })),
    dates: $('time,[class*="meta"],.artDate,.artInfo,.source,.date').toArray().slice(0, 8).map((node) => ({ class: $(node).attr('class'), text: $(node).text().trim().slice(0, 120) })),
    paragraphParents: $('p').toArray().slice(0, 10).map((element) => ({ text: $(element).text().trim().slice(0, 45), parents: $(element).parents().toArray().slice(0, 3).map((node) => `${node.tagName}.${$(node).attr('class') || ''}#${$(node).attr('id') || ''}`) })),
    metadata: $('meta').toArray().map((element) => ({ key: $(element).attr('name') || $(element).attr('property'), value: $(element).attr('content') })).filter((item) => /author|source|title|date|time/i.test(item.key || '')),
    containers: containers.map((selector) => ({ selector, count: $(selector).length, characters: $(selector).first().text().trim().length, paragraphs: $(selector).first().find('p').length })).filter((item) => item.count),
    candidates: $('a').toArray().map((element) => ({ href: $(element).attr('href'), title: $(element).text().trim() })).filter((item) => /AI登|奇葩投诉|经济学首先|逛超市/.test(item.title)),
  }));
}
