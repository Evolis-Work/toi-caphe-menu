import type { ReactNode } from "react";

interface LuxuryPageLayoutProps {
  baseUrl: string;
  isScrolled: boolean;
  onSearchClick?: () => void;
  showSearchButton?: boolean;
  categoryNav?: ReactNode;
  children: ReactNode;
}

export default function LuxuryPageLayout({
  baseUrl,
  isScrolled,
  onSearchClick,
  showSearchButton = true,
  categoryNav,
  children,
}: Readonly<LuxuryPageLayoutProps>) {
  return (
    <div className="bg-[#0A0A0A] text-luxury-text min-h-screen font-sans selection:bg-luxury-accent selection:text-black antialiased">
      <div className="max-w-md mx-auto min-h-screen bg-luxury-bg relative flex flex-col border-x border-luxury-border/20">
        <header
          className={`sticky top-0 z-50 transition-all duration-500 px-8 py-6 flex items-center justify-between border-b border-luxury-border/10 ${
            isScrolled ? "bg-luxury-bg/95 backdrop-blur-md py-4" : "bg-transparent"
          }`}
        >
          <div className="flex flex-col">
            <h1 className="text-xl font-bebas tracking-[0.1em] text-luxury-text">
              T.Ô.I <span className="text-luxury-accent font-light">COFFEE &amp; TEA</span>
            </h1>
          </div>

          {showSearchButton ? (
            <button
              className="text-luxury-muted hover:text-luxury-accent transition-colors"
              type="button"
              onClick={onSearchClick}
            >
              <span className="material-symbols-outlined font-light text-[24px]">search</span>
            </button>
          ) : <span className="w-6" aria-hidden="true"></span>}
        </header>

        {categoryNav}

        <main className="flex-1 px-8 pt-10 pb-24 space-y-16">{children}</main>

        <footer className="bg-[#0A0A0A] border-t border-luxury-border/10 py-16 px-10 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="font-bebas text-lg tracking-[0.3em] text-white">
              T.Ô.I <span className="text-luxury-accent">COFFEE &amp; TEA</span>
            </h2>
            <p className="text-[11px] text-luxury-muted/60 uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              2CJC+V6R, Ấp 4, Đông Hải, Bạc Liêu
            </p>
          </div>
          <p className="font-cormorant italic text-luxury-muted text-sm max-w-[80%] mx-auto leading-relaxed">
            Chất lượng là nền tảng cho sự thành công của bạn.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            <a
              href={`${baseUrl.replace(/\/?$/, "/")}visit`}
              className="size-10 rounded-full border border-luxury-border/20 flex items-center justify-center text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">map</span>
            </a>
            <a
              href="tel:#"
              className="size-10 rounded-full border border-luxury-border/20 flex items-center justify-center text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
            <a
              href="mailto:#"
              className="size-10 rounded-full border border-luxury-border/20 flex items-center justify-center text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
          <p className="font-sans text-[10px] text-luxury-muted/30 uppercase tracking-[0.2em]">
            © 2026 EVOLIS WORK • PREMIUM EDITION
          </p>
        </footer>
      </div>
    </div>
  );
}
