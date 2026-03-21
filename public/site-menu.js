(() => {
  const init = () => {
    if (window.__SITE_MENU_BOUND__) {
      return;
    }
    window.__SITE_MENU_BOUND__ = true;

    const openBtn = document.getElementById("open-site-menu");
    const closeBtn = document.getElementById("close-site-menu");
    const overlay = document.getElementById("site-menu-overlay");
    const sheet = document.getElementById("site-menu-sheet");
    const sheetCloseButton = closeBtn;
    const menuLinks = document.querySelectorAll(".site-menu-link");

    if (!openBtn || !closeBtn || !overlay || !sheet) {
      return;
    }

    const openMenu = () => {
      overlay.hidden = false;
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      sheetCloseButton.focus();
    };

    const closeMenu = () => {
      overlay.hidden = true;
      sheet.hidden = true;
      sheet.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.focus();
    };

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && !sheet.hidden) {
          closeMenu();
        }
      },
      { passive: true }
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
