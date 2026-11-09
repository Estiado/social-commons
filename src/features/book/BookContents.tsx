import { Link, useOutletContext } from 'react-router-dom';
import { BOOK_CHAPTERS } from './chapters';
import { BookTypeField } from './BookTypeField';
import { TYPE_PAPER_GRADIENT } from './typePaper';
import './type-home.css';

export default function BookContents() {
  const { openSearch } = useOutletContext<{ openSearch: () => void }>();

  return (
    <section
      className="book-contents"
      aria-label="社科通识总目录"
      data-book-scene
      style={{ backgroundImage: TYPE_PAPER_GRADIENT }}
    >
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
          <div>
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
                </Link>
              ))}
            </div>
            <div className="type-home-tools">
              <button type="button" onClick={openSearch} data-tour="home-search">
                全站搜索
              </button>
              <Link to="/reading" data-no-book-turn>
                阅读空间
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <BookTypeField />
    </section>
  );
}
