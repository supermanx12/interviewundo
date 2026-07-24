import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const error = new Error('Sentry Server Test Error from interviewUndo API!');
  Sentry.captureException(error);
  return NextResponse.json({ error: 'Server error triggered' }, { status: 500 });
}
