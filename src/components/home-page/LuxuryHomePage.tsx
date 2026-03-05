import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory, MenuItem } from "../../types/menu";
import LuxuryPageLayout from "../layout/LuxuryPageLayout";

interface LuxuryHomePageProps {
  baseUrl: string;
  categories: MenuCategory[];
}

/**
 * OFFICE_DESCRIPTIONS: Tông giọng tinh tế, chuyên nghiệp cho người trưởng thành
 */
const OFFICE_DESCRIPTIONS: Record<string, string> = {
  "Ca phe sua da": "Sự kết hợp cân bằng giữa cà phê rang đậm và sữa đặc truyền thống, mang lại năng lượng bền bỉ.",
  "Bac xiu": "Sữa tươi hòa quyện cùng chút cà phê nồng nàn, lựa chọn nhẹ nhàng cho buổi sáng tỉnh táo.",
  "Ca phe muoi": "Lớp kem muối mịn màng khơi dậy hậu vị đậm đà của cà phê, một trải nghiệm hương vị đầy tinh tế.",
  "Tra dao cam sa": "Vị trà thanh khiết điểm xuyết hương sả nồng nàn và cam tươi, giúp giải tỏa căng thẳng hiệu quả.",
  "Cookie da xay": "Thức uống đá xay béo ngậy với bánh cookie giòn tan, phù hợp cho những phút nghỉ ngơi thư giãn.",
  Matcha: "Bột trà xanh Nhật Bản thượng hạng kết hợp sữa tươi, mang lại cảm giác thanh tịnh và giàu chất chống oxy hóa.",
  "Tra Trai Cay": "Tổng hòa các loại trái cây nhiệt đới tươi mới trên nền trà thanh tao, tiếp thêm vitamin cho ngày làm việc.",
  "Cafe trung": "Lớp kem trứng bông mịn như lụa che chở dòng cà phê nóng hổi, một di sản hương vị Việt Nam.",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(price: number): string {
  return `${Math.round(price / 1000)}.000đ`;
}

function getFallbackSrc(baseUrl: string): string {
  return `${baseUrl.replace(/\/?$/, "/")}placeholder.svg`;
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ImageWithFallback({ src, alt, className, fallbackSrc }: { src: string; alt: string; className: string; fallbackSrc: string }) {
  return (
    <img
      alt={alt}
      className={className}
      src={src || fallbackSrc}
      onError={(event) => {
        event.currentTarget.src = fallbackSrc;
      }}
      loading="lazy"
    />
  );
}

function LuxuryMenuCard({ item, fallbackSrc }: { item: MenuItem; fallbackSrc: string }) {
  const description = OFFICE_DESCRIPTIONS[item.name] || item.description || "Hương vị nguyên bản, chọn lọc từ những hạt cà phê thượng hạng.";

  if (!item.available) {
    return (
      <div className="w-full flex items-start gap-4 opacity-50 grayscale py-4 border-b border-luxury-border/20">
        <div className="relative size-20 shrink-0 bg-luxury-surface overflow-hidden rounded-sm">
          <ImageWithFallback alt={item.name} className="w-full h-full object-cover" fallbackSrc={fallbackSrc} src={item.image} />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-bebas text-lg tracking-widest text-luxury-muted">{item.name}</h4>
          <span className="text-xs text-luxury-muted uppercase tracking-widest">Tạm hết hàng</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 group cursor-pointer py-6 border-b border-luxury-border/30 last:border-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bebas text-xl tracking-[0.05em] text-luxury-text group-hover:text-luxury-accent transition-colors duration-300 uppercase">
              {item.name}
            </h4>
            {item.bestseller && (
              <span className="text-[9px] font-sans border border-luxury-accent/50 text-luxury-accent px-1.5 py-0.5 tracking-tighter uppercase">
                Khuyên dùng
              </span>
            )}
          </div>

          <p className="font-cormorant text-[15px] leading-relaxed text-luxury-muted/90 italic">{description}</p>

          <div className="flex items-center gap-3 pt-1">
            <span className="font-sans text-base text-luxury-accent font-medium">{formatPrice(item.price)}</span>

            <div className="flex gap-1.5 items-center opacity-50">
              {(item.temp === "hot" || item.temp === "both") && (
                <span className="material-symbols-outlined !text-base text-orange-400" title="Nóng">
                  local_fire_department
                </span>
              )}
              {(item.temp === "cold" || item.temp === "both") && (
                <span className="material-symbols-outlined !text-base text-blue-300" title="Lạnh">
                  ac_unit
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative size-24 shrink-0 bg-luxury-surface overflow-hidden rounded-sm shadow-sm group-hover:shadow-luxury-accent/10 transition-shadow">
          <ImageWithFallback
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fallbackSrc={fallbackSrc}
            src={item.image}
          />
        </div>
      </div>
    </div>
  );
}

export default function LuxuryHomePage({ baseUrl, categories }: Readonly<LuxuryHomePageProps>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(slugify(categories[0]?.name || ""));
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollState, setScrollState] = useState({ left: false, right: true });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fallbackSrc = getFallbackSrc(baseUrl);
  const normalizedQuery = normalizeText(searchQuery.trim());

  const checkScroll = (): void => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollState({
        left: scrollLeft > 10,
        right: scrollLeft + clientWidth < scrollWidth - 10,
      });
    }
  };

  const filteredCategories = useMemo(() => {
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
        return { name: category.name, items };
      })
      .filter((category) => category.items.length > 0);
  }, [categories, normalizedQuery]);

  const handleCategoryClick = (categoryName: string): void => {
    const id = slugify(categoryName);
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleRecommendationClick = (keyword: string): void => {
    setSearchQuery(keyword);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = (): void => {
      setIsScrolled(window.scrollY > 50);

      if (filteredCategories.length === 0) {
        return;
      }
      const sectionIds = filteredCategories.map((c) => slugify(c.name));
      const offsetTop = 180;

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
      setActiveCategory(nextActive);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [filteredCategories]);

  return (
    <LuxuryPageLayout
      baseUrl={baseUrl}
      isScrolled={isScrolled}
      onSearchClick={() => document.getElementById("search-input")?.focus()}
      categoryNav={
        <div
          className={`sticky top-[73px] z-40 bg-luxury-bg/95 backdrop-blur-md border-b border-luxury-border/10 transition-all ${
            isScrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="relative overflow-hidden">
            <div
              className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-luxury-bg to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                scrollState.left ? "opacity-100" : "opacity-0"
              }`}
            ></div>

            <div
              className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-luxury-bg via-luxury-bg/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 flex items-center justify-end pr-2 ${
                scrollState.right ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="material-symbols-outlined text-luxury-accent/40 text-sm animate-pulse">chevron_right</span>
            </div>

            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="w-full overflow-x-auto no-scrollbar flex items-center gap-10 px-8 h-14 scroll-smooth"
            >
              {filteredCategories.map((category) => {
                const isActive = activeCategory === slugify(category.name);
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="relative h-full flex items-center shrink-0 group"
                    type="button"
                  >
                    <span
                      className={`font-bebas text-sm tracking-[0.2em] transition-all duration-300 uppercase whitespace-nowrap ${
                        isActive ? "text-luxury-accent" : "text-luxury-muted hover:text-luxury-text"
                      }`}
                    >
                      {category.name}
                    </span>
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-accent"></span>}
                  </button>
                );
              })}
              <div className="shrink-0 w-10"></div>
            </div>
          </div>
        </div>
      }
    >
      {!searchQuery && (
        <section className="relative w-[calc(100%+4rem)] -mx-8 aspect-square flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 p-10 space-y-4">
            <h2 className="font-bebas text-5xl leading-[1.1] text-white">
              THƯỞNG THỨC <br /> <span className="text-luxury-accent">SỰ TINH TÚY</span>
            </h2>
            <div className="w-12 h-[1px] bg-luxury-accent"></div>
            <p className="font-cormorant italic text-luxury-muted text-lg max-w-[90%] leading-relaxed">
              Nâng tầm trải nghiệm cà phê mỗi ngày cho những tâm hồn trân trọng giá trị nguyên bản.
            </p>
          </div>
        </section>
      )}

      {!searchQuery && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-bebas text-luxury-accent tracking-widest text-xs">COLLECTION</span>
            <div className="h-[1px] flex-1 bg-luxury-border/20"></div>
          </div>
          <h3 className="font-bebas text-2xl tracking-wide text-white uppercase">Gợi ý cho bạn</h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Năng lượng tập trung", keyword: "Cafe", icon: "center_focus_strong" },
              { title: "Thư giãn nhẹ nhàng", keyword: "Tra", icon: "self_improvement" },
              { title: "Gặp gỡ đối tác", keyword: "Signature", icon: "handshake" },
              { title: "Tươi mới cơ thể", keyword: "Soda", icon: "eco" },
            ].map((rec) => (
              <button
                key={rec.title}
                onClick={() => handleRecommendationClick(rec.keyword)}
                className="flex flex-col items-center gap-3 p-4 bg-luxury-surface/40 border border-luxury-border/20 rounded-sm hover:border-luxury-accent/30 transition-all text-center group"
                type="button"
              >
                <span className="material-symbols-outlined text-luxury-muted group-hover:text-luxury-accent transition-colors text-xl font-light">
                  {rec.icon}
                </span>
                <span className="font-cormorant text-[13px] text-luxury-muted group-hover:text-luxury-text italic">{rec.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="relative group">
        <input
          id="search-input"
          className="w-full bg-transparent border-b border-luxury-border/30 text-luxury-text text-sm font-sans placeholder:text-luxury-muted/40 py-3 pr-8 focus:outline-none focus:border-luxury-accent transition-all duration-500"
          placeholder="Tìm kiếm món uống theo yêu cầu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-muted"
            onClick={() => setSearchQuery("")}
            type="button"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      <section className="space-y-20">
        {filteredCategories.map((category) => (
          <div key={category.name} id={slugify(category.name)} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="font-bebas text-2xl text-white tracking-[0.2em] uppercase">{category.name}</h3>
              <div className="h-[1px] flex-1 bg-luxury-border/10"></div>
            </div>

            <div className="flex flex-col">
              {category.items.map((item) => (
                <LuxuryMenuCard key={item.name} item={item} fallbackSrc={fallbackSrc} />
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-cormorant italic text-luxury-muted text-lg">Xin lỗi, chúng tôi không tìm thấy kết quả phù hợp.</p>
          </div>
        )}
      </section>
    </LuxuryPageLayout>
  );
}
