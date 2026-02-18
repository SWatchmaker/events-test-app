import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEARCH_EVENTS } from '@/api/events';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data, loading, error } = useQuery(SEARCH_EVENTS, {
    variables: {
      input: {
        category: categoryFilter,
        status: statusFilter,
      },
    },
  });

  const handleFiltersReset = () => {
    setCategoryFilter(null);
    setStatusFilter(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Eventos</h1>
        <p className="text-muted-foreground">
          Manage your events, track status, and organize your schedule.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Select
          value={categoryFilter || ''}
          onValueChange={(value) => setCategoryFilter(value || null)}
        >
          <SelectTrigger className="w-full md:w-45">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WORKSHOP">Workshop</SelectItem>
            <SelectItem value="MEETUP">Meetup</SelectItem>
            <SelectItem value="TALK">Talk</SelectItem>
            <SelectItem value="SOCIAL">Social</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || ''}
          onValueChange={(value) => setStatusFilter(value || null)}
        >
          <SelectTrigger className="w-full md:w-45">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleFiltersReset}
          variant="outline"
          className="ml-auto"
        >
          Reset Filters
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading events...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-red-500"
                >
                  Failed to load events.
                </TableCell>
              </TableRow>
            ) : data?.searchEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              data?.searchEvents.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() =>
                    navigate({
                      to: '/byId/$eventId',
                      params: { eventId: event.id },
                    })
                  }
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.organizer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === 'CONFIRMED'
                          ? 'default'
                          : event.status === 'CANCELLED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
