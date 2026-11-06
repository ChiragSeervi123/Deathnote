import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { RouteLoader } from '@/components/loading/RouteLoader';
import { useReducedMotion } from '@/state/runtime';

export function RootLayout() {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full';
  }, [reduced]);

  // New route → start at the top (scroll restoration is per-route by design).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <SkipLink />
      <div id="dn-veil" className="veil" aria-hidden="true" />
      <Suspense fallback={<RouteLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
}
