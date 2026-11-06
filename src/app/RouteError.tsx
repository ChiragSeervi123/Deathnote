import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import '@/routes/NotFound.css';

/** Designed route-level failure page — never a blank screen (SPEC §11.4). */
export function RouteError() {
  const error = useRouteError();
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <main className="notfound" id="content" tabIndex={-1}>
      <p className="mono-label">Case file corrupted</p>
      <h1 className="notfound__title">This page could not be written.</h1>
      <p className="notfound__text">
        Something failed while loading this part of the experience. The rest of the site is unaffected.
      </p>
      <p className="notfound__detail mono-label">{detail}</p>
      <div className="notfound__actions">
        <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
          Reload
        </button>
        <Link className="button" to="/">
          Main experience
        </Link>
        <Link className="button" to="/tribute">
          Creator tribute
        </Link>
      </div>
    </main>
  );
}
