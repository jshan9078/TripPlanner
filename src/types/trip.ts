import { z } from 'zod';
import { Activity } from './activity';
import { Note } from './note';

export const ActivitySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startTime: z.string(),
  duration: z.number().min(0),
  date: z.string(),
  tripId: z.string()
});

export const NoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Note content is required"),
  date: z.string(),
  tripId: z.string()
});

export const TripSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Trip title is required"),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  activities: z.array(z.any()),
  notes: z.array(z.any())
});

export type Activity = z.infer<typeof ActivitySchema>;
export type Note = z.infer<typeof NoteSchema>;
export type Trip = z.infer<typeof TripSchema>;