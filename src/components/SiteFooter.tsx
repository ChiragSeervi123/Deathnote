import { Link } from 'react-router';
import './SiteFooter.css';

/** Fan-work disclaimer (SPEC §14) — present on every route. */
export function SiteFooter({ variant = 'main' }: { variant?: 'main' | 'tribute' }) {
  return (
    <footer className={`site-footer site-footer--${variant}`}>
      <div className="site-footer__inner">
        <div className="site-footer__disclaimer">
          <p className="mono-label">Unofficial fan tribute</p>
          <p>
            This is a non-commercial fan project. It is not affiliated with, endorsed by, or
            connected to Tsugumi Ohba, Takeshi Obata, Shueisha, Madhouse, VAP, Viz Media or any
            other rights holder, and it does not imply that the creators have seen or approved it.
          </p>
          <p>
            <span lang="en">DEATH NOTE</span> © Tsugumi Ohba, Takeshi Obata / SHUEISHA. Characters
            and story belong to their owners. All illustration, 3D scenes and sound on this site are
            original fan work; no anime footage, soundtrack, manga pages or official artwork are
            used.
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          {variant === 'main' ? (
            <Link to="/tribute">A tribute to its creators</Link>
          ) : (
            <Link to="/">The main experience</Link>
          )}
          <a href="#content">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
