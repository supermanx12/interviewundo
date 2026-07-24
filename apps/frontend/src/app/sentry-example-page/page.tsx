'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryExamplePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full p-6 rounded-xl border border-border bg-card shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold">Sentry Instrumentation Test</h1>
        <p className="text-sm text-muted-foreground">
          Use the buttons below to test Sentry Client & Server error capturing.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              throw new Error('Sentry Client Test Error from interviewUndo!');
            }}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
          >
            Trigger Client Error
          </button>

          <button
            onClick={async () => {
              await fetch('/api/sentry-example-api');
            }}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Trigger Server Error
          </button>
        </div>
      </div>
    </div>
  );
}
