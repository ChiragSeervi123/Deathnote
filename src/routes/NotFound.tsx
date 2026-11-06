import { useEffect } from 'react';
import { Link } from 'react-router';
import './NotFound.css';

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · DEATH NOTE — The Judgment';
  }, []);

  return (
    <main className="notfound" id="content" tabIndex={-1}>
      <p className="mono-label">Error 404 · Name not found</p>
      <h1 className="notfound__title">No name is written on this page.</h1>
      <p className="notfound__text">
        The page you were looking for does not exist — or was never written.
      </p>
      <div className="notfound__actions">
        <Link className="button button--primary" to="/">
          Enter the main experience
        </Link>
        <Link className="button" to="/tribute">
          The creator tribute
        </Link>
      </div>
    </main>
  );
}
