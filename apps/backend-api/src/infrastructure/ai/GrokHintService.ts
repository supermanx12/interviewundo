import { env } from '../../config/env';
import type { IHintService } from '../../domain/ports/services/IHintService';

// ============================================================
// GrokHintService
// Concrete service adapter for xAI Grok API hint generation
// ============================================================

export class GrokHintService implements IHintService {
  private readonly apiKey = env.GROK_API_KEY;
  private readonly model = env.GROK_MODEL;
  private readonly baseUrl = 'https://api.x.ai/v1/chat/completions';

  async generateHint(problemDescription: string, userCode: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        'Grok API key is not configured. Please set GROK_API_KEY in your environment.',
      );
    }

    const systemPrompt = `You are a helpful and experienced technical interview coach.
Your job is to guide the user with a conceptual hint to solve their coding problem.
CRITICAL CONSTRAINT: Do NOT provide any code snippets, solutions, syntax corrections, or code-blocks.
Focus on the algorithm, logic, data structure, or overall approach.
Keep your response concise: exactly 1 or 2 sentences.`;

    const userPrompt = `Here is the coding challenge:
${problemDescription}

Here is my current code implementation:
\`\`\`javascript
${userCode}
\`\`\`

Give me a conceptual hint on how to proceed. Remember, NO CODE!`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grok API returned status ${response.status}: ${errorText}`);
      }

      const payload = (await response.json()) as any;
      const hint = payload.choices?.[0]?.message?.content;

      if (!hint) {
        throw new Error('Invalid or empty response choice returned from Grok API');
      }

      return hint.trim();
    } catch (err: any) {
      console.error('Error in GrokHintService:', err);
      throw new Error(`Failed to generate hint: ${err.message}`);
    }
  }
}
