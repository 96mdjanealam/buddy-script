import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Code */}
        <p className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#0081ff] to-[#0060cc] select-none leading-none mb-4">
          404
        </p>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0081ff] hover:bg-[#0060cc] text-white text-sm font-semibold px-6 py-3 rounded-md shadow-sm transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Feed
        </Link>
      </div>
    </main>
  );
}
