export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950/70 backdrop-blur-xl mt-10">
      
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 text-center">

        {/* LOGO */}
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
          ASSIGNPRO ✨
        </h2>

        {/* TAGLINE */}
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Smart AI tools for better assignments
        </p>

        {/* LINKS */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-white/10 my-5"></div>

        {/* COPYRIGHT */}
        <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed px-2">
          © {new Date().getFullYear()} ASSIGNPRO. All rights reserved.
          <br className="sm:hidden" />
          <span className="block sm:inline mt-1 sm:mt-0">
            Made by Muhammad Rabi Khan
          </span>
        </p>

      </div>
    </footer>
  );
}