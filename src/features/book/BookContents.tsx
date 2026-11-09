import { Link, useOutletContext } from 'react-router-dom';
import { BookTypeField } from './BookTypeField';
import { TYPE_PAPER_GRADIENT } from './typePaper';
import './type-home.css';

const chapters = [
  { label: '日新', path: '/daily' },
  { label: '群鉴', path: '/events' },
  { label: '撷英', path: '/quotes' },
  { label: '议论文素材', path: '/essay' },
  { label: '观澜', path: '/guanlan' },
  { label: '知天下', path: '/world' },
];

export default function BookContents() {
  const { openSearch } = useOutletContext<{ openSearch: () => void }>();

  return (
    <section
      className="book-contents type-home"
      aria-label="社科通识总目录"
      style={{ backgroundImage: TYPE_PAPER_GRADIENT }}
    >
      <div className="book-contents-ink">
        <h1 className="book-masthead">社科通识</h1>
        <nav className="book-contents-nav" aria-labelledby="book-contents-heading">
          <h2 id="book-contents-heading" className="book-directory-heading">
            目录
          </h2>
          <div>
            <div className="book-chapter-columns">
              {chapters.map((chapter) => (
                <Link key={chapter.path} to={chapter.path} className="book-chapter-link">
                  {chapter.label}
                </Link>
              ))}
            </div>
            <div className="type-home-tools">
              <button type="button" onClick={openSearch}>
                全站搜索
              </button>
              <Link to="/reading">阅读空间</Link>
            </div>
          </div>
        </nav>
      </div>
      <BookTypeField />
      <a className="type-home-credit" href="/type-study/licenses/MATERIALS.md">
        材质出处
      </a>
    </section>
  );
}
