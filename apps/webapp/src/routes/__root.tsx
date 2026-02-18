import * as React from 'react';
import { Navigate, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ToastContainer } from 'react-toastify';
import { authClient } from '@/lib/auth';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <Navigate to="/dashboard" replace />,
});

function RootComponent() {
  const { isPending, data } = authClient.useSession();

  React.useEffect(() => {
    if (!data) return;

    localStorage.setItem('token', data.session.token);
  }, [data]);

  if (isPending) return <div>Loading...</div>;

  return (
    <React.Fragment>
      <>
        <ToastContainer />
        <Outlet />
        <TanStackRouterDevtools />
      </>
    </React.Fragment>
  );
}
