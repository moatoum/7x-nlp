import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/engine/ai';
import type { RequestFields } from '@/engine/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      currentFields,
    }: {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      currentFields: Partial<RequestFields>;
    } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt(currentFields);

    // Build message history for Claude
    const claudeMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsed;
    try {
      // Try to extract JSON from the response (handle potential markdown wrapping)
      let jsonStr = textContent.text.trim();

      // Strip markdown code blocks if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return the raw text as a message with no extractions
      parsed = {
        message: textContent.text,
        extractedFields: {},
        suggestedOptions: [],
        confidence: 0.5,
        shouldShowRecommendations: false,
        allFieldsComplete: false,
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
