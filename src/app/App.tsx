import { createBrowserRouter, RouterProvider } from 'react-router';
import { RootLayout } from './RootLayout';
import { RouteError } from './RouteError';

/**
 * Route-level code splitting (SPEC §10.2): each route is its own chunk. The
 * tribute never depends on the main experience having been visited (SPEC §8.3).
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/routes/MainExperience')).MainExperience }),
      },
      {
        path: 'tribute',
        lazy: async () => ({ Component: (await import('@/routes/Tribute')).Tribute }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/routes/NotFound')).NotFound }),
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
