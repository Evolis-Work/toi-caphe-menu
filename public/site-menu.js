(() => {
  const init = () => {
    const openBtn = document.getElementById("open-site-menu");
    const closeBtn = document.getElementById("close-site-menu");
    const overlay = document.getElementById("site-menu-overlay");
    const sheet = document.getElementById("site-menu-sheet");
    const menuLinks = document.querySelectorAll(".site-menu-link");

    if (!openBtn || !closeBtn || !overlay || !sheet) {
      return;
    }

    const openMenu = () => {
      overlay.hidden = false;
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
    };

    const closeMenu = () => {
      overlay.hidden = true;
      sheet.hidden = true;
      sheet.setAttribute("aria-hidden", "true");
    };

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
