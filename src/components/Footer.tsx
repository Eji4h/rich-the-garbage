const GITHUB_URL = 'https://github.com/Eji4h/rich-the-garbage';

export default function Footer() {
  return (
    <footer className="relative py-16 text-center overflow-hidden bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-blue-100/50 backdrop-blur-sm">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="relative z-10">
        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
        </div>

        {/* GitHub Link */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-800 hover:text-purple-700 transition-colors mb-4 group"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">View on GitHub</span>
        </a>

        {/* Copyright */}
        <p className="text-slate-800 font-medium mb-2">
          &copy; {new Date().getFullYear()} Rich The Garbage
        </p>
        <p className="text-sm text-slate-700">
          Crafted with <span className="text-pink-500">♥</span> and creativity
        </p>
      </div>
    </footer>
  );
}
