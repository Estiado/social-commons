import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WORLD_STORIES } from '@/data/world/catalogue';
import { ReadingEntrance } from '@/features/motion/ReadingEntrance';
import '@/features/world/world.css';

export default function WorldPage() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const stories = WORLD_STORIES.filter((item) =>
    [item.title, item.summary, ...item.keywords].join(' ').toLowerCase().includes(normalized),
  );
  return (
    <ReadingEntrance className="world-page">
      <header className="world-intro" data-reading-enter>
        <h1>知天下</h1>
        <div>
          <p className="world-lead">
            读懂一件事的来处，
            <br />
            再看今天发生了什么。
          </p>
          <p>
            从中文媒体报道进入，用关键时间点串起长期事件。国际文件、不同立场和资料日期，留在每个节点旁边。
          </p>
        </div>
      </header>
      <section aria-labelledby="world-tracks-heading" className="world-tracks" data-reading-enter>
        <div className="world-list-heading">
          <h2 id="world-tracks-heading">长期追踪</h2>
          <label>
            查找事件
            <input
              type="search"
              aria-label="搜索知天下"
              placeholder="俄乌、加沙、联合国…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <p role="status" className="world-count">
          {normalized ? `找到 ${stories.length} 条事件脉络` : '首批三条 · 资料核对至2026年10月27日'}
        </p>
        <div className="world-stories">
          {stories.map((story) => (
            <article key={story.id} className="world-story-row">
              <div className="world-period">
                <p>{story.category}</p>
                <p>{story.period}</p>
              </div>
              <div>
                <h3>
                  <Link to={'/world/' + story.id}>{story.title}</Link>
                </h3>
                <p>{story.summary}</p>
                <p className="world-update">
                  最近资料节点：
                  <time dateTime={story.latestEventDate}>{story.latestEventDate}</time>
                </p>
              </div>
              <Link
                className="world-read-link"
                to={'/world/' + story.id}
                aria-label={'阅读' + story.title + '时间线'}
              >
                阅读时间线
              </Link>
            </article>
          ))}
        </div>
        {!stories.length && (
          <div className="world-empty">
            <p>没有找到这条事件，试试“俄乌”“加沙”或“联合国”。</p>
            <button onClick={() => setQuery('')}>清空搜索</button>
          </div>
        )}
      </section>
      <section className="world-note" data-reading-enter>
        <h2>把今日消息放回时间里</h2>
        <p>
          节点说明“发生了什么”，后面接上它改变了什么。报道、各方表态和机构文件分别署名；未发生的会谈与尚未落实的安排，不提前写成结果。
        </p>
        <Link to="/guanlan/events/global-risk-2026">继续阅读：联合国2026年全球风险报告</Link>
      </section>
    </ReadingEntrance>
  );
}
