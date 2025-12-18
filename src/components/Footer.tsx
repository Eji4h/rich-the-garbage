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

        {/* Copyright */}
        <p className="text-slate-600 font-medium mb-2">
          &copy; {new Date().getFullYear()} Rich The Garbage
        </p>
        <p className="text-sm text-slate-500">
          Crafted with <span className="text-pink-500">♥</span> and creativity
        </p>
      </div>
    </footer>
  );
}
