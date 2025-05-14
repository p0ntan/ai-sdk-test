import { z } from 'zod';

// Define a schema for the 9 expertise-based areas
export const notificationSchema = z.object({
  title: z.string().describe('Name of the expertise area.'),
  description: z.string().describe('Short explanation of this area in the context of the user’s expertise.'),
  suggestions: z.array(z.string())
    .min(2)
    .max(3)
    .describe('2–3 actionable or insightful suggestions related to this area.'),
});
