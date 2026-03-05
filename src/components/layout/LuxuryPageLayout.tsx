import { useEffect, useState, type ReactNode } from "react";

interface LuxuryPageLayoutProps {
  baseUrl: string;
  isScrolled: boolean;
  onSearchClick?: () => void;
  showSearchButton?: boolean;
  categoryNav?: ReactNode;
  footerNav?: ReactNode;
  children: ReactNode;
}

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export default function LuxuryPageLayout({
  baseUrl,
  isScrolled,
  onSearchClick,
  showSearchButton = true,
  categoryNav,
  footerNav,
  children,
}: Readonly<LuxuryPageLayoutProps>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navLinks = [
    { href: `${baseUrl.replace(/\/?$/, "/")}`, label: "Thực đơn" },
    { href: `${baseUrl.replace(/\/?$/, "/")}visit`, label: "Ghé quán" },
    { href: `${baseUrl.replace(/\/?$/, "/")}about`, label: "Giới thiệu" },
    { href: `${baseUrl.replace(/\/?$/, "/")}contact`, label: "Liên hệ" },
    { href: `${baseUrl.replace(/\/?$/, "/")}sitemap`, label: "Sơ đồ trang" },
  ];

  const currentNormalized = normalizePath(currentPath);
  const isActiveLink = (href: string, label: string): boolean => {
    const hrefNormalized = normalizePath(href);
    if (label === "Thực đơn") {
      return currentNormalized === hrefNormalized || currentNormalized === `${hrefNormalized}/index`;
    }
    return currentNormalized === hrefNormalized;
  };

  const getNavClass = (active: boolean): string =>
    `border border-luxury-border/30 px-4 py-3 text-xs tracking-[0.2em] uppercase transition-colors ${
      active ? "text-luxury-accent border-luxury-accent bg-luxury-accent/5" : "text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent"
    }`;

  const getFooterLinkClass = (active: boolean): string =>
    `text-[10px] tracking-[0.16em] uppercase transition-colors ${
      active ? "text-luxury-accent" : "text-luxury-muted hover:text-luxury-accent"
    }`;

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

          <div className="flex items-center gap-2">
            {showSearchButton ? (
              <button
                className="size-9 rounded-full border border-luxury-border/30 flex items-center justify-center text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-colors"
                type="button"
                onClick={onSearchClick}
                aria-label="Mở tìm kiếm"
              >
                <span className="material-symbols-outlined font-light text-[20px]">search</span>
              </button>
            ) : null}

            <button
              className="size-9 rounded-full border border-luxury-border/30 flex items-center justify-center text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-colors"
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Mở menu điều hướng"
            >
              <span className="material-symbols-outlined font-light text-[20px]">menu</span>
            </button>
          </div>
        </header>

        {isMenuOpen ? (
          <>
            <button
              type="button"
              aria-label="Đóng menu điều hướng"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[70]"
            ></button>

            <aside
              className="fixed left-1/2 -translate-x-1/2 top-4 w-[min(26rem,calc(100%-1.5rem))] z-[80] bg-luxury-surface border border-luxury-border/40 rounded-sm p-5"
            >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bebas text-xl tracking-[0.16em] text-white uppercase">Điều hướng</h2>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="size-8 rounded-full border border-luxury-border/40 text-luxury-muted hover:text-luxury-accent hover:border-luxury-accent transition-colors flex items-center justify-center"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <nav className="grid grid-cols-1 gap-2">
            {navLinks.map((item) => {
              const active = isActiveLink(item.href, item.label);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={getNavClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
            </aside>
          </>
        ) : null}

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
              href="tel:0848882852"
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
          {footerNav ?? (
            <nav className="grid grid-cols-4 gap-2 pt-2 max-w-[320px] mx-auto">
              {navLinks.slice(1).map((item) => {
                const active = isActiveLink(item.href, item.label);
                return (
                  <a key={item.href} href={item.href} className={getFooterLinkClass(active)} aria-current={active ? "page" : undefined}>
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}
          <p className="font-sans text-[10px] text-luxury-muted/80 uppercase tracking-[0.2em]">
            © 2026 EVOLIS WORK • PREMIUM EDITION
          </p>
        </footer>
      </div>
    </div>
  );
}
