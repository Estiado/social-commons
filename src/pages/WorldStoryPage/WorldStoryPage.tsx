import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getWorldStory } from '@/data/world';
import type { WorldStory } from '@/data/world/types';
import { worldStoryDocument } from '@/features/world/storyDocument';
import { ContentReader } from '@/features/reading/ContentReader';
import type { TextBlock } from '@/features/reading/model';
import '@/features/world/world.css';

export default function WorldStoryPage() {
  const { id = '' } = useParams();
  const { hash } = useLocation();
  const [loaded, setLoaded] = useState<{ id: string; story?: WorldStory; error?: string }>();
  useEffect(() => {
    let active = true;
    getWorldStory(id)
      .then((story) => {
        if (active) setLoaded({ id, story });
      })
      .catch(() => {
        if (active) setLoaded({ id, error: '事件资料暂时无法加载，请刷新后重试。' });
      });
    return () => {
      active = false;
    };
  }, [id]);
  const story = loaded?.id === id ? loaded.story : undefined;
  const document = useMemo(() => (story ? worldStoryDocument(story) : undefined), [story]);
  const prefix = 'world-' + id;
  useEffect(() => {
    if (!document || !hash.startsWith('#' + prefix + '-')) return;
    const seek = () => {
      const target = window.document.getElementById(hash.slice(1));
      if (!target) return false;
      target.scrollIntoView({ block: 'start' });
      return true;
    };
    if (seek()) return;
    const observer = new MutationObserver(() => {
      if (seek()) observer.disconnect();
    });
    observer.observe(window.document.querySelector('main')!, { subtree: true, childList: true });
    const timer = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [document, hash, prefix]);
  if (loaded?.id !== id)
    return (
      <p role="status" className="p-10 text-center">
        正在打开事件脉络…
      </p>
    );
  if (!story || !document)
    return (
      <div className="p-10 text-center">
        <p>{loaded.error || '未找到这条事件'}</p>
        <Link to="/world" className="text-accent underline">
          返回知天下
        </Link>
      </div>
    );
  const headings = document.blocks.filter((block): block is TextBlock => block.type === 'heading');
  const href = (text: string) =>
    '#' + prefix + '-' + headings.find((block) => block.text === text)?.id;
  return (
    <article className="world-page world-detail">
      <Link to="/world" className="world-back">
        返回知天下
      </Link>
      <header className="world-story-heading">
        <h1>{story.title}</h1>
        <p className="world-period">
          {story.period} · {story.category}
        </p>
        <p>{story.summary}</p>
        <p className="world-update">
          资料核对至 <time dateTime={story.updatedAt}>{story.updatedAt}</time>
        </p>
        <div className="world-jump">
          <a href={href('最近进展')}>先看最近进展</a>
          <a href={href('时间脉络')}>从头阅读</a>
        </div>
      </header>
      <div className="world-reading-layout">
        <aside className="world-wayfinding">
          <nav aria-label="知天下阅读目录">
            <h2>阅读目录</h2>
            {headings
              .filter((block) => block.level === 2)
              .map((block) => (
                <a key={block.id} href={'#' + prefix + '-' + block.id}>
                  {block.text}
                </a>
              ))}
          </nav>
          <label className="world-node-select">
            跳到时间节点
            <select
              aria-label="跳到时间节点"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) window.location.hash = event.target.value;
              }}
            >
              <option value="" disabled>
                选择一个节点
              </option>
              {story.timeline.map((point) => (
                <option key={point.id} value={href(point.dateLabel + ' · ' + point.title)}>
                  {point.dateLabel} · {point.title}
                </option>
              ))}
            </select>
          </label>
        </aside>
        <div className="world-reading">
          <ContentReader key={id} kind="world" id={id} document={document} idPrefix={prefix} />
        </div>
      </div>
      {story.relatedEventIds.length > 0 && (
        <section className="world-note">
          <h2>继续往下读</h2>
          <Link to="/guanlan/events/global-risk-2026">全球风险报告：战争、技术与共同应对</Link>
          <Link to="/world">返回全部事件脉络</Link>
        </section>
      )}
    </article>
  );
}
