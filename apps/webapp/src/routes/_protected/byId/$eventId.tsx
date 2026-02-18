import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Calendar as CalendarIcon,
  MapPin,
  ArrowLeft,
  Users,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GET_EVENT_BY_ID } from '@/api/events/getById';
import { useQuery } from '@apollo/client/react';

export const Route = createFileRoute('/_protected/byId/$eventId')({
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { eventId } = Route.useParams();

  const { data, loading, error } = useQuery(GET_EVENT_BY_ID, {
    variables: { getEventId: eventId },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Failed to load event details. Please try again later.
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-destructive">Event not found.</div>;
  }

  const event = data.getEvent;

  return (
    <div className="flex flex-col gap-6">
      {/* Header / Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {format(event.date, 'PPP')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline">{event.category}</Badge>
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
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content: Description & Attendees */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              About this Event
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          <Separator />

          {/* Attendees Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Attendees
              </h2>
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                {event.attendees?.length || 0}
              </Badge>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!event.attendees || event.attendees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 opacity-20" />
                          <p>No attendees yet. Be the first to join!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    event.attendees.map((attendee, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center gap-3 font-medium">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee.name}`}
                              alt={attendee.name}
                            />
                            <AvatarFallback>
                              {attendee.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          {attendee.name}
                        </TableCell>
                        <TableCell>{attendee.email}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Sidebar: Registration & Organizer */}
        <div className="flex flex-col gap-6 md:col-span-1">
          {/* Registration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="attendance-mode" />
                <Label htmlFor="attendance-mode">
                  I will attend this event
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organizer</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <div className="font-medium">{event.organizer.name}</div>
                <div className="text-muted-foreground text-xs">
                  {event.organizer.email}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
