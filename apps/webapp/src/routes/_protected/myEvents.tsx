import { MY_EVENTS } from '@/api/events/getMyEvents';
import { EventsTable } from '@/components/EventsTable';
import { useQuery } from '@apollo/client/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/myEvents')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, loading, error } = useQuery(MY_EVENTS);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Eventos</h1>
        <p className="text-muted-foreground">
          Manage your events, track status, and organize your schedule.
        </p>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <EventsTable
          events={data?.getMyEvents}
          isLoading={loading}
          isError={!!error}
        />
      </div>
    </div>
  );
}
