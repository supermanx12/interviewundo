export function Footer() {
  return (
    <footer className="py-12 border-t border-fey-smoke/30 mt-32 relative z-10 bg-fey-ink">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="text-fey-graphite">
          © {new Date().getFullYear()} interviewUndo. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-4 items-center text-fey-mist">
          <span className="text-fey-graphite">Built with</span>
          <span>Next.js</span>
          <span className="text-fey-smoke">•</span>
          <span>TypeScript</span>
          <span className="text-fey-smoke">•</span>
          <span>Tailwind CSS</span>
          <span className="text-fey-smoke">•</span>
          <span>Monaco</span>
          <span className="text-fey-smoke">•</span>
          <span>Docker</span>
        </div>
      </div>
    </footer>
  );
}
