export default function Homepage(): JSX.Element {
  return (
    <div>
        <div className="coffee-stain top-20 -left-10 w-64 h-64 border-[12px] border-primary rounded-full">
        </div>
        <div className="coffee-stain bottom-40 -right-20 w-80 h-80 border-[20px] border-primary rounded-full">
        </div>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-primary/10">
            <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-2xl text-white shadow-lg shadow-primary/30 rotate-3">
                  <span className="material-symbols-outlined text-3xl">coffee</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-playful tracking-tight">
                  T.O.I CÀ PHÊ
                </h1>
              </div>
            </div>
            <div className="max-w-4xl mx-auto overflow-x-auto hide-scrollbar flex gap-3 p-4">
              <a className="category-btn flex-none px-6 py-2.5 rounded-3xl bg-primary text-white text-sm font-bold shadow-playful" href="#coffee">Cà phê</a>
              <a className="category-btn flex-none px-6 py-2.5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-primary/10 text-slate-700 dark:text-slate-300 text-sm font-bold hover:border-primary/40 hover:bg-cream" href="#tea">Trà trái cây</a>
              <a className="category-btn flex-none px-6 py-2.5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-primary/10 text-slate-700 dark:text-slate-300 text-sm font-bold hover:border-primary/40 hover:bg-cream" href="#ice-blended">Đá xay</a>
              <a className="category-btn flex-none px-6 py-2.5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-primary/10 text-slate-700 dark:text-slate-300 text-sm font-bold hover:border-primary/40 hover:bg-cream" href="#pastry">Bánh ngọt</a>
            </div>
          </header>
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-12">
            <section className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-floating group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10">
              </div>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDda1hRie3IlJx9bU66vJtsbCmlqY07DB5VJuqAa8p-IalhCIZhJdwat1V01BHJBIDy51B3JFfxbJFUFTb3B7CtzDd3NwimycrB88NkVVS0zAAkXQUEQb6C14FFWKM-81MccAFfZJk5_2fSp0D0obsMrQZvEW5fvsKAn5QblNYAbfmpXvZVXir1s1Zim_aQNKxM-0_fQawRRA65gqRkZPeHT2-B_c91TTqcOqlQWreF0pXzOc0rOdo2UDY_I7fbU6nMmNJ0jhoZSNJZ")'}}>
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <span className="inline-block px-4 py-1.5 bg-accent text-white text-[11px] font-black rounded-full mb-4 tracking-widest uppercase shadow-lg -rotate-1">MÓN MỚI THÁNG NÀY</span>
                <h2 className="text-white text-4xl font-black leading-tight mb-2">
                  Signature Cold Brew
                </h2>
                <p className="text-white/90 text-sm max-w-sm font-medium leading-relaxed">
                  Hương vị đậm đà, ủ lạnh trong 24 giờ cho sự tỉnh táo tuyệt đối và
                  hậu vị ngọt thanh.
                </p>
              </div>
            </section>
            <div className="space-y-8" id="coffee">
              <div className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
                <h3 className="text-3xl font-black flex items-center gap-3 font-playful">
                  <span className="material-symbols-outlined text-primary text-4xl p-2 bg-primary/5 rounded-full">local_cafe</span>
                  Cà phê
                </h3>
                <span className="text-sm font-bold px-4 py-1.5 bg-primary/10 text-primary rounded-full">12 món</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hover-scale flex gap-5 bg-white dark:bg-slate-800/60 p-4 rounded-3xl shadow-playful border-2 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="relative flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-md rotate-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXQu8yaUCyMk6yqopAKykwQ3mmfpGLdmDNTga8w_RAxlZrUIW2DLLvsGhB0HgXoLFLBcC5Z1Km01K0UZaY1UxzUK80s2CBh5fHHgy8d9zLGia9lg_LX9lvNIsOQCpPGNI6JI9Uprui3WfZaHcZHuvFz7idqVOgKeOhacwr1vmeZFjW9y1d63O1fa5uGRnZTE1Cl2awSTCIof_IpDULOoW8NRTVPfdpgXbXoMRWfuJl96d2cRfl5qSiBsWN4plQC2obd9fjIx9BYN0B")'}}>
                    </div>
                    <span className="absolute -top-3 -left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider -rotate-6">HOT!</span>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                      Cà phê Muối
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                      Sự kết hợp hoàn hảo giữa vị đắng cà phê và lớp kem muối béo
                      ngậy đặc trưng.
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-black text-primary">45.000đ</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">add</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 opacity-80 relative overflow-hidden">
                  <div className="relative flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center grayscale blur-[1px]" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAddDTS8c1NcckBBIWLOH1kd3eavyiXRFJmrHSzMvy3fHTY52GfaIVHEoYqDrHs2wBvpYO9ON8sEX6ZKRSq6pMZDS2iWDOEWuwgJJK6870KzdABvnBGWcbK4jfbh8aq2TD2ObWWWUPrlQ0dsPy9ZA1i_CU6nqhQobmhxAVaNB4uZS3NHQq9S5nYYuE2GijxhSf5exrtg0zZ5pY-Uj_znucRiYACyPVaN1TZIlo6hvTIPskJFzxzKYPOesoq-gxHXc3Xd1UgMVX6cZT")'}}>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="sold-out-stamp text-[14px] text-red-600 font-black bg-white/90 px-4 py-1.5 rounded-lg uppercase tracking-tighter border-2 border-red-600 shadow-xl">HẾT HÀNG</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-bold text-xl text-slate-400 dark:text-slate-600 line-through">
                      Matcha Coffee
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-700 mt-2 italic font-medium">
                      Hẹn bạn ngày mai nhé!
                    </p>
                    <div className="mt-3">
                      <span className="text-xl font-bold text-slate-300 dark:text-slate-800">59.000đ</span>
                    </div>
                  </div>
                </div>
                <div className="hover-scale flex gap-5 bg-white dark:bg-slate-800/60 p-4 rounded-3xl shadow-playful border-2 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-md -rotate-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_0DKnnL7N6OEkKt98UOHP1vWodfTAHAdGL-Jz4uE9XnXdPCJMxq6WgfYd4SDifLFeYvbLgrRBPcZQNKNBaBIdece4aM-sZCPfJ1dc2UprdigtavTniMZwL5YxCxNOe6zLuZo1EFE11LUspZu309IZej8xfCKVDzruMksUzh4FqF9SCiA67PGhwvYb9FJ-iWWpK0Oi-9-szRfGimGuOVt1LsGBtm6N485tnv2df6zQVi2Xcmk5bw4gLpqcsOximgXeTkS4b-w9J7Vm")'}}>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                      Cappuccino
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                      Cà phê espresso pha cùng sữa nóng và lớp bọt mịn màng nghệ
                      thuật.
                    </p>
                    <div className="mt-3">
                      <span className="text-xl font-black text-primary">55.000đ</span>
                    </div>
                  </div>
                </div>
                <div className="hover-scale flex gap-5 bg-white dark:bg-slate-800/60 p-4 rounded-3xl shadow-playful border-2 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-md rotate-2" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD88frRb-2uK4fO_hyosyyXvRvRBetUz51fdNGwwUQ74k_OTlaG1FsXhHsgDsIC3BPadVkLCCarsHcj88xaAUdilyIbDAQjhjS0TPOPmUI56BpBEnBdk5MzD3R9ONQYCqRy2vd9gI-OzkQDRTEmRV144e3u6D0OLIwJPo6_y7GLmHgpD1rwmCm3KMACHEw4BlQKCxnBdtsAY1Hnjmf99sYhkKPRECszxRcv-w-AtT7xyVgceuEp1fVIgEX0vrX_Yqs2xJqWeWAqliD8")'}}>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                      Bạc Xỉu
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                      Nhiều sữa tươi béo ngậy, ít cà phê cho ngày làm việc hứng
                      khởi.
                    </p>
                    <div className="mt-3">
                      <span className="text-xl font-black text-primary">32.000đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8" id="tea">
              <div className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
                <h3 className="text-3xl font-black flex items-center gap-3 font-playful">
                  <span className="material-symbols-outlined text-primary text-4xl p-2 bg-primary/5 rounded-full">eco</span>
                  Trà trái cây
                </h3>
                <span className="text-sm font-bold px-4 py-1.5 bg-primary/10 text-primary rounded-full">8 món</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hover-scale flex gap-5 bg-white dark:bg-slate-800/60 p-4 rounded-3xl shadow-playful border-2 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-md rotate-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCs4jIlqHKBVcoBVuw9VCOcZRbazyLA26l0MN7P_8RmdmBiuIuNqbcUav-3gqbYejJ8e3BIuHTtWwEAvLVFc5lw3gOIddw-JnLgTvLgHt92kId2EWfIZCwisuFp-nOQxXYheVhfB0gu9QtYEJd5X3VLypnC8u5JDnL3MZCP2BO9qAFNl_j7dB6dy3g2MqtHMGeZ7T_mZ5KAzDxqlsx5Vknx8AO8G8eW6bx3v2Uj8EmwLxR_Ea1jsmfI2_64gOCCxPCmAqIH_E-vXmJA")'}}>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                      Trà Đào Cam Sả
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                      Vị thanh ngọt của đào, hương cam tươi và sả thơm mát sảng
                      khoái.
                    </p>
                    <div className="mt-3">
                      <span className="text-xl font-black text-primary">52.000đ</span>
                    </div>
                  </div>
                </div>
                <div className="hover-scale flex gap-5 bg-white dark:bg-slate-800/60 p-4 rounded-3xl shadow-playful border-2 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="relative flex-none">
                    <div className="w-28 h-28 rounded-2xl bg-cover bg-center shadow-md -rotate-2" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBG0ohpDHqsEtIdNKFVu7LaQMFsPysI-T16iKRr3fVhfi_3AhIytEoVH6D8N2xzhpRbUrMgrMHGF6XappbS9cq1hsb7ZdKCXP1ZKkFJZ-CU2NdoUCp3fVuYPymr6Y4JnnQQisn5Zf2S3JY6l9wMAikrEIhWwhTiG6AMGvsKLB-pKrU2GLodpCvOpLAark_wdBKiPnxn6U_a45YWrR40dLa6EP9rW4i5Dp9ERQKP4WdSDhon90cgjCw1fHEfX92IPv-2sr9gHNIj2pDC")'}}>
                    </div>
                    <span className="absolute -top-3 -left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider -rotate-6">BEST</span>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                      Trà Vải Sen
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                      Hương sen nhẹ nhàng tinh khiết kết hợp cùng vải thiều ngọt
                      lịm.
                    </p>
                    <div className="mt-3">
                      <span className="text-xl font-black text-primary">49.000đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="bg-primary/5 rounded-3xl p-8 border-2 border-dashed border-primary/20 text-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/10 rounded-full blur-xl">
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium relative z-10">
                * Vui lòng liên hệ nhân viên tại quầy để được phục vụ tốt nhất. <br />
                Giá trên đã bao gồm thuế VAT.
              </p>
            </section>
          </main>
          <footer className="bg-white dark:bg-slate-950 mt-16 py-12 px-4 border-t border-primary/5 relative overflow-hidden">
            <div className="blob w-64 h-64 -bottom-32 -left-32" />
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary rotate-12">
                  <span className="material-symbols-outlined text-2xl font-bold">coffee</span>
                </div>
                <span className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white font-playful">T.O.I CÀ PHÊ</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-slate-500 font-bold uppercase tracking-widest font-playful">
                <a className="hover:text-primary transition-colors hover-bounce" href="#">Về chúng tôi</a>
                <a className="hover:text-primary transition-colors hover-bounce" href="#">Cửa hàng</a>
                <a className="hover:text-primary transition-colors hover-bounce" href="#">Liên hệ</a>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium tracking-wide">
                  © 2024 T.O.I Cà Phê Digital Menu.
                </div>
                <div className="group flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 transition-all hover:bg-primary/10 cursor-default">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Dự án thực hiện bởi</span>
                  <span className="font-playful text-lg font-black text-primary tracking-wider hover-bounce inline-block">Evolis Work</span>
                </div>
              </div>
            </div>
          </footer>
          <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-primary/10 shadow-floating flex justify-around items-center py-3 rounded-3xl md:hidden">
            <a className="flex flex-col items-center gap-1 text-primary group" href="#">
              <div className="p-1 rounded-full group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">Thực đơn</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors group" href="#">
              <div className="p-1 rounded-full group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">info</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Thông tin</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors group" href="#">
              <div className="p-1 rounded-full group-active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-2xl">location_on</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Vị trí</span>
            </a>
          </nav>
        </div>
    </div>
  );
}
