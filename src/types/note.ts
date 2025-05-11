import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Note content is required"),
  tripId: z.string()
});

export type Note = z.infer<typeof NoteSchema>; 