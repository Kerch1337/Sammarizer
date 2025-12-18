export const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>
          © {new Date().getFullYear()} Video Summarizer
        </span>

        <span className="opacity-40">•</span>

        <a
          href="https://github.com/Kerch1337/Sammarizer"
          target="_blank"
          rel="noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
