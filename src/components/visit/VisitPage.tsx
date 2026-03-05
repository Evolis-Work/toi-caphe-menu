import { useEffect, useMemo, useState } from "react";
import LuxuryPageLayout from "../layout/LuxuryPageLayout";

interface VisitPageProps {
  baseUrl: string;
}

export default function VisitPage({ baseUrl }: Readonly<VisitPageProps>) {
  const menuHref = useMemo(() => `${baseUrl.replace(/\/?$/, "/")}`, [baseUrl]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <LuxuryPageLayout baseUrl={baseUrl} isScrolled={isScrolled} showSearchButton={false}>
      <section className="space-y-4 -mt-4">
        <div className="w-12 h-[1px] bg-luxury-accent/50"></div>
        <h2 className="text-xl font-bebas tracking-[0.2em] text-luxury-accent uppercase">Thông tin cửa hàng</h2>
      </section>

      <section className="space-y-8">
        <div className="flex items-start gap-5">
          <div className="size-10 shrink-0 rounded-full border border-luxury-accent/20 flex items-center justify-center bg-luxury-accent/5">
            <span className="material-symbols-outlined text-luxury-accent text-xl">location_on</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-bebas tracking-widest text-xs text-luxury-muted">Địa chỉ</h3>
            <p className="font-cormorant italic text-[17px] leading-relaxed text-luxury-text">
              2CJC+V6R, Ấp 4, <br />
              Đông Hải, Bạc Liêu, Vietnam
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="size-10 shrink-0 rounded-full border border-luxury-accent/20 flex items-center justify-center bg-luxury-accent/5">
            <span className="material-symbols-outlined text-luxury-accent text-xl">schedule</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-bebas tracking-widest text-xs text-luxury-muted">Giờ mở cửa</h3>
            <p className="font-cormorant italic text-[17px] text-luxury-text">06:00 – 22:00 hàng ngày</p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="size-10 shrink-0 rounded-full border border-luxury-accent/20 flex items-center justify-center bg-luxury-accent/5">
            <span className="material-symbols-outlined text-luxury-accent text-xl">call</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-bebas tracking-widest text-xs text-luxury-muted">Liên hệ</h3>
            <p className="font-cormorant italic text-[17px] text-luxury-text">Vui lòng cập nhật số điện thoại</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bebas tracking-widest text-xs text-luxury-accent uppercase">Bản đồ chỉ đường</h3>
          <div className="h-[1px] flex-1 bg-luxury-border"></div>
        </div>

        <div className="relative w-full aspect-square bg-luxury-surface border border-luxury-border rounded-sm overflow-hidden shadow-2xl group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.345249908061!2d105.41601448885494!3d9.032236300000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a167006daf6363%3A0x784c799c0d076c9f!2sT.%C3%94.i%20COFFEE%20%26%20TEA!5e0!3m2!1sen!2s!4v1772729018388!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-90 grayscale-[0.2] contrast-110"
            title="Google map T.O.I COFFEE & TEA"
          ></iframe>
        </div>

        <a
          href="https://maps.app.goo.gl/CRVaWKVn6ZGLa1Q36"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 border border-luxury-accent/30 bg-luxury-accent/5 text-luxury-accent font-bebas text-sm tracking-[0.25em] hover:bg-luxury-accent hover:text-black transition-all active:scale-[0.98]"
        >
          MỞ TRÊN GOOGLE MAPS
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </section>

      <div className="pt-8 text-center">
        <a href={menuHref} className="inline-flex items-center gap-2 font-cormorant italic text-luxury-muted hover:text-luxury-accent transition-colors group">
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
          Quay lại khám phá thực đơn
        </a>
      </div>
    </LuxuryPageLayout>
  );
}
