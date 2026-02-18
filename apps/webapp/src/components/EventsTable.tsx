import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export interface EventSummary {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer?: {
    name: string;
    email: string;
  };
  category: string;
  status: string;
}

interface EventsTableProps {
  events: EventSummary[] | undefined;
  noOrganizer?: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function EventsTable({
  events,
  noOrganizer = false,
  isLoading,
  isError,
}: EventsTableProps) {
  const navigate = useNavigate();

  return (
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
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={noOrganizer ? 5 : 6}
              className="h-24 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading events...
              </div>
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell
              colSpan={noOrganizer ? 5 : 6}
              className="h-24 text-center text-red-500"
            >
              Failed to load events.
            </TableCell>
          </TableRow>
        ) : !events || events.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={noOrganizer ? 5 : 6}
              className="h-24 text-center"
            >
              No events found.
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
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
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.location}</TableCell>
              {!noOrganizer && (
                <TableCell>{event.organizer?.name || '-'}</TableCell>
              )}
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
  );
}
