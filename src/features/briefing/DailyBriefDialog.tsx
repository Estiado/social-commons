import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReadingEntrance } from '@/features/motion/ReadingEntrance';
import { briefingEdition } from './edition';
import './briefing.css';

export default function DailyBriefDialog({
  day,
  onClose,
  onNavigate,
}: {
  day: string;
  onClose(): void;
  onNavigate(): void;
}) {
  const edition = briefingEdition(day);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className="daily-brief-dialog">
        <header className="brief-heading">
          <div>
            <DialogTitle className="font-serif text-2xl font-semibold">每日简报</DialogTitle>
            <p className="brief-date">
              <time dateTime={day}>{day.replaceAll('-', ' / ')}</time> · 北京时间
            </p>
          </div>
          <DialogClose asChild>
            <button aria-label="关闭每日简报" className="brief-close">
              <X size={21} />
            </button>
          </DialogClose>
        </header>
        <DialogDescription className="brief-description">
          每天读一则时事、一篇诗文、一个概念。时事资料按所标日期更新。
        </DialogDescription>
        <ReadingEntrance className="brief-readings">
          <section data-reading-enter>
            <h2 className="brief-section-title">时事</h2>
            <Link className="brief-news-title" to={edition.news.path} onClick={onNavigate}>
              {edition.news.title}
            </Link>
            <p className="brief-meta">
              {edition.news.source} · {edition.news.date}
            </p>
            <p className="brief-body">{edition.news.text}</p>
          </section>
          <section data-reading-enter>
            <h2 className="brief-section-title">名句</h2>
            <blockquote className="brief-poem">{edition.quote.text}</blockquote>
            <Link
              className="brief-attribution"
              to={'/quotes/' + edition.quote.id}
              onClick={onNavigate}
            >
              {edition.quote.author} · {edition.quote.source}
            </Link>
          </section>
          <section data-reading-enter>
            <h2 className="brief-section-title">概念</h2>
            <Link
              className="brief-concept-title"
              to={'/daily/' + edition.concept.id}
              onClick={onNavigate}
            >
              {edition.concept.title}
            </Link>
            <p className="brief-body">{edition.concept.summary}</p>
          </section>
        </ReadingEntrance>
        <footer className="brief-actions">
          <Link className="brief-primary" to={'/briefing?date=' + day} onClick={onNavigate}>
            阅读与保存这份简报
          </Link>
          <DialogClose asChild>
            <button className="brief-secondary">开始浏览</button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
