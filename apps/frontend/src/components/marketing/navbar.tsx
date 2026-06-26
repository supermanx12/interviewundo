import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-fey-white text-lg font-bold tracking-[-0.053em]">
          interviewUndo
        </Link>
        <div className="hidden md:flex items-center gap-1 bg-[#191919] rounded-full p-1 border border-white/5">
          <Link
            href="/docs"
            className="text-fey-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#131313] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/github"
            className="text-fey-graphite text-sm font-medium px-4 py-1.5 rounded-full hover:text-fey-white transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-fey-graphite text-sm font-medium px-4 py-2 hover:text-fey-white transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-fey-white text-sm font-medium px-5 py-2 rounded-full border border-white/10 bg-fey-ink hover:bg-fey-charcoal transition-colors shadow-[0_0_14px_rgba(255,255,255,0.15)]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
