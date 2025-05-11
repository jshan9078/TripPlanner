import { z } from 'zod';

export const ActivitySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startTime: z.string(),
  duration: z.number().min(0),
  date: z.string(),
  tripId: z.string()
});

export type Activity = z.infer<typeof ActivitySchema>; 