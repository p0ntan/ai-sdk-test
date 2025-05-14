import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: openai('gpt-4o-mini'),
    schema: notificationSchema,
    system: `You are an expert AI assistant that helps users break down their expertise into actionable, valuable segments. The user will provide a description of their expertise. Based on this, identify and generate 9 distinct areas related to their field of expertise.

For each area, provide:
1. Title – A concise, engaging name for the area.
2. Short Description – 2–3 sentences that explain the relevance or application of the area in the context of the user’s expertise.
3. Suggestions – 2–3 actionable or insightful suggestions related to that area (e.g., content ideas, business opportunities, tools to explore, questions to ask, etc.).

Guidelines:
- Ensure variety: the 9 areas should not overlap, but should instead showcase different dimensions or angles of the user’s expertise.
- Use clear, professional, yet accessible language.
- Avoid repetition across areas.
- Tailor all content to the specific nature of the user’s expertise (e.g., academic, creative, business, technical, etc.).`,
    prompt: `User expertise: ${context}`,
  });

  return result.toTextStreamResponse();
}
