import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory, MenuItem } from "../../types/menu";

interface HomepagePageProps {
  baseUrl: string;
  categories: MenuCategory[];
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("vi-VN")}đ`;
}

function formatCompactPrice(price: number): string {
  return `${Math.round(price / 1000)}k`;
}

function getFallbackSrc(baseUrl: string): string {
  return `${baseUrl.replace(/\/?$/, "/")}placeholder.svg`;
}

function getFeaturedItem(categories: MenuCategory[]): MenuItem | null {
  const items = categories.flatMap((category) => category.items);

  return (
    items.find((item) => item.bestseller && item.available) ??
    items.find((item) => item.available) ??
    items[0] ??
    null
  );
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ImageWithFallback({ src, alt, className, fallbackSrc }: Readonly<{ src: string; alt: string; className: string; fallbackSrc: string }>): JSX.Element {
  return (
    <img
      alt={alt}
      className={className}
      src={src || fallbackSrc}
      onError={(event) => {
        event.currentTarget.src = fallbackSrc;
      }}
    />
  );
}

function MenuRow({ item, fallbackSrc }: Readonly<{ item: MenuItem; fallbackSrc: string }>): JSX.Element {
  if (!item.available) {
    return (
      <div className="flex gap-6 items-start opacity-50">
        <div className="relative shrink-0">
          <ImageWithFallback
            alt={item.name}
            className="size-24 rounded-sm object-cover grayscale"
            fallbackSrc={fallbackSrc}
            src={item.image}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h4 className="font-medium text-[15px] tracking-wide truncate pr-2">{item.name}</h4>
            <span className="text-[14px] line-through font-light">{formatCompactPrice(item.price)}</span>
          </div>
          <p className="text-scandi-muted text-xs leading-relaxed mb-4 font-light">
            {item.description || "Sản phẩm đang tạm hết, hẹn bạn lần sau nhé."}
          </p>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-scandi-muted border border-scandi-border px-2 py-1">
            Out of Stock
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="relative shrink-0">
        <ImageWithFallback
          alt={item.name}
          className="size-24 rounded-sm object-cover"
          fallbackSrc={fallbackSrc}
          src={item.image}
        />
        {item.bestseller ? (
          <span className="absolute -top-2 -left-2 bg-scandi-black text-white text-[8px] px-2 py-1 tracking-widest uppercase font-medium">
            Popular
          </span>
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1.5">
          <h4 className="font-medium text-[15px] tracking-wide truncate pr-2">{item.name}</h4>
          <span className="text-[14px] font-light">{formatCompactPrice(item.price)}</span>
        </div>
        <p className="text-scandi-muted text-xs leading-relaxed line-clamp-2 mb-4 font-light">
          {item.description || "Hương vị cân bằng, nhẹ nhàng và dễ uống mỗi ngày."}
        </p>
        <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-scandi-muted">
          Gọi nhân viên để order
        </span>
      </div>
    </div>
  );
}

export default function HomepagePage({ baseUrl, categories }: Readonly<HomepagePageProps>): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>(slugify(categories[0]?.name ?? ""));
  const [showRightScrollHint, setShowRightScrollHint] = useState<boolean>(false);
  const tabScrollRef = useRef<HTMLDivElement | null>(null);
  const fallbackSrc = getFallbackSrc(baseUrl);
  const normalizedQuery = normalizeText(searchQuery.trim());

  const filteredCategories = useMemo<MenuCategory[]>(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => {
        const categoryMatch = normalizeText(category.name).includes(normalizedQuery);
        const items = category.items.filter((item) => {
          if (categoryMatch) {
            return true;
          }

          const inName = normalizeText(item.name).includes(normalizedQuery);
          const inDescription = normalizeText(item.description).includes(normalizedQuery);
          return inName || inDescription;
        });

        return {
          name: category.name,
          items
        };
      })
      .filter((category) => category.items.length > 0);
  }, [categories, normalizedQuery]);

  const featuredItem = getFeaturedItem(filteredCategories.length > 0 ? filteredCategories : categories);

  useEffect(() => {
    const firstSlug = slugify(filteredCategories[0]?.name ?? "");
    const hasActive = filteredCategories.some((category) => slugify(category.name) === activeCategory);

    if (!hasActive && firstSlug) {
      setActiveCategory(firstSlug);
    }
  }, [activeCategory, filteredCategories]);

  useEffect(() => {
    const tabScroll = tabScrollRef.current;
    if (!tabScroll) {
      return;
    }

    const updateScrollHint = (): void => {
      const canScroll = tabScroll.scrollWidth > tabScroll.clientWidth + 1;
      const atEnd = tabScroll.scrollLeft + tabScroll.clientWidth >= tabScroll.scrollWidth - 2;
      setShowRightScrollHint(canScroll && !atEnd);
    };

    updateScrollHint();
    tabScroll.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    return () => {
      tabScroll.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [filteredCategories]);

  useEffect(() => {
    if (filteredCategories.length === 0) {
      return;
    }

    const sectionIds = filteredCategories.map((category) => slugify(category.name));
    let ticking = false;

    const updateActiveFromScroll = (): void => {
      const offsetTop = 220;
      let nextActive = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) {
          continue;
        }

        const top = section.getBoundingClientRect().top;
        if (top - offsetTop <= 0) {
          nextActive = id;
        } else {
          break;
        }
      }

      setActiveCategory((current) => (current === nextActive ? current : nextActive));
      ticking = false;
    };

    const onScroll = (): void => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filteredCategories]);

  useEffect(() => {
    if (!activeCategory) {
      return;
    }

    const tabScroll = tabScrollRef.current;
    if (!tabScroll) {
      return;
    }

    const activeTab = tabScroll.querySelector<HTMLButtonElement>(`button[data-category-id="${activeCategory}"]`);
    activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  const handleCategoryClick = (categoryName: string): void => {
    const targetId = slugify(categoryName);
    setActiveCategory(targetId);
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-scandi-bg text-scandi-text antialiased min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-scandi-bg min-h-screen relative flex flex-col border-x border-scandi-border">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] text-scandi-muted mb-0.5">Est. 2024</span>
            <h1 className="text-lg font-medium tracking-widest uppercase">T.O.I Cà Phê</h1>
          </div>
          <button className="size-8 flex items-center justify-center rounded-full text-scandi-black" type="button">
            <span className="material-symbols-outlined font-light text-[22px]">search</span>
          </button>
        </header>

        <div className="px-6 pb-4 pt-1 border-b border-scandi-border">
          <label className="relative block">
            <span className="material-symbols-outlined text-[18px] font-light text-scandi-muted absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              className="w-full h-10 border border-scandi-border bg-scandi-accent/40 pl-10 pr-10 text-[13px] tracking-wide placeholder:text-scandi-muted/80 focus:outline-none focus:border-scandi-black transition-colors"
              placeholder="Tìm món theo tên hoặc mô tả..."
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
            {searchQuery ? (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center text-scandi-muted hover:text-scandi-black transition-colors"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <span className="material-symbols-outlined text-[18px] font-light">close</span>
              </button>
            ) : null}
          </label>
        </div>

        <div className="sticky top-[78px] z-40 bg-white/90 backdrop-blur-md border-y border-scandi-border">
          <div className="relative flex items-center">
            <div ref={tabScrollRef} className="w-full overflow-x-auto no-scrollbar flex items-center gap-6 px-6 h-14 scroll-smooth">
              {filteredCategories.map((category) => (
                <button
                  className="relative h-full shrink-0 flex items-center whitespace-nowrap group"
                  key={category.name}
                  data-category-id={slugify(category.name)}
                  type="button"
                  onClick={() => {
                    handleCategoryClick(category.name);
                  }}
                >
                  <span
                    className={`text-[12px] font-medium uppercase tracking-widest ${
                      activeCategory === slugify(category.name)
                        ? "text-scandi-black"
                        : "text-scandi-muted hover:text-scandi-black transition-colors"
                    }`}
                  >
                    {category.name}
                  </span>
                  {activeCategory === slugify(category.name) ? <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-scandi-black"></span> : null}
                </button>
              ))}
            </div>

            {showRightScrollHint ? (
              <div className="absolute right-0 top-0 bottom-0 pointer-events-none">
                <div className="w-14 h-full bg-gradient-to-l from-white via-white/85 to-transparent"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-scandi-muted/80 animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  <span className="material-symbols-outlined text-[16px] -ml-2">chevron_right</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <main className="flex-1 p-6 space-y-12">
          {featuredItem ? (
            <section>
              <div className="relative w-full rounded-sm overflow-hidden border border-scandi-border group">
                <ImageWithFallback
                  alt={featuredItem.name}
                  className="w-full aspect-[16/10] object-cover"
                  fallbackSrc={fallbackSrc}
                  src={featuredItem.image}
                />
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-scandi-muted block mb-1.5">Chef&apos;s Signature</span>
                      <h2 className="text-xl font-medium tracking-tight">{featuredItem.name}</h2>
                    </div>
                    <span className="text-base font-light">{formatPrice(featuredItem.price)}</span>
                  </div>
                  <p className="text-scandi-muted text-sm leading-relaxed mb-6 font-light">
                    {featuredItem.description ||
                      "Vị mặn mòi của biển cả kết hợp với vị đắng cà phê, tạo nên hương vị khó quên cho buổi sáng tinh khôi."}
                  </p>
                  <div className="w-full py-3 border border-scandi-border text-scandi-muted text-[11px] font-medium uppercase tracking-[0.2em] text-center">
                    Gọi nhân viên để order
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {filteredCategories.map((category) => (
            <section className="scroll-mt-40" id={slugify(category.name)} key={category.name}>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] border-b border-scandi-black/10 pb-1.5">{category.name}</h3>
                <span className="text-[10px] text-scandi-muted tracking-widest">
                  {String(category.items.length).padStart(2, "0")} ITEMS
                </span>
              </div>
              <div className="space-y-12">
                {category.items.map((item) => (
                  <MenuRow fallbackSrc={fallbackSrc} item={item} key={`${category.name}-${item.name}`} />
                ))}
              </div>
            </section>
          ))}

          {filteredCategories.length === 0 ? (
            <section className="py-12 text-center border border-scandi-border bg-scandi-accent/40">
              <p className="text-sm text-scandi-muted">Không tìm thấy món phù hợp. Thử từ khóa khác nhé.</p>
            </section>
          ) : null}
        </main>

        <footer className="px-6 pb-2 pt-2 text-center border-t border-scandi-border">
          <p className="text-[11px] tracking-wide text-scandi-muted">
            Made by <span className="text-scandi-black font-medium">Evolis Work</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
