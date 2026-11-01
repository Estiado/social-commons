import { Link } from 'react-router-dom';
import { BOOK_CHAPTERS } from './chapters';
import { BookMist } from './BookMist';

export default function BookContents() {
  return (
    <section className="book-contents" aria-label="社科通识总目录" data-book-scene>
      <div className="book-landscape" aria-hidden="true">
        <img
          className="book-paper-photo"
          src="/book/qianziwen-paper.webp"
          width="2400"
          height="1400"
          alt=""
          fetchPriority="high"
        />
      </div>
      <div className="book-contents-ink">
        <h1 className="book-masthead book-floating-type" data-book-letter aria-label="社科通识">
          {Array.from('社科通识').map((character, index) => (
            <span key={index} data-book-glyph aria-hidden="true">
              {character}
            </span>
          ))}
        </h1>
        <nav
          className="book-contents-nav"
          aria-labelledby="book-contents-heading"
          data-tour="book-contents"
        >
          <h2
            id="book-contents-heading"
            className="book-directory-heading book-floating-type"
            data-book-letter
            aria-label="目录"
          >
            {Array.from('目录').map((character, index) => (
              <span key={index} data-book-glyph aria-hidden="true">
                {character}
              </span>
            ))}
          </h2>
          <div className="book-chapter-columns">
            {BOOK_CHAPTERS.map((chapter) => (
              <Link
                key={chapter.id}
                to={chapter.path}
                className="book-chapter-link book-floating-type"
                data-book-letter
                aria-label={chapter.label}
                data-tour={'home-' + (chapter.id === 'guanlan' ? 'topics' : chapter.id)}
              >
                <span aria-hidden="true">
                  {Array.from(chapter.label).map((character, index) => (
                    <span key={index} data-book-glyph>
                      {character}
                    </span>
                  ))}
                </span>
                <span className="book-link-mark" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <BookMist />
    </section>
  );
}
