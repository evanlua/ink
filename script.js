(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#themeToggle");
  const shareButton = document.querySelector("#shareButton");
  const currentYear = document.querySelector("#currentYear");
  const toast = document.querySelector("#toast");
  const toastMessage = document.querySelector("#toastMessage");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let toastTimer;

  const getSavedTheme = () => {
    try {
      return localStorage.getItem("evanlua-theme");
    } catch {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem("evanlua-theme", theme);
    } catch {
      // A página continua funcionando quando o armazenamento está indisponível.
    }
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
    themeColor.setAttribute("content", isDark ? "#000000" : "#ffffff");
  };

  const initialTheme = getSavedTheme() || "dark";

  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });

  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado para a área de transferência!");
    } catch {
      const helper = document.createElement("textarea");
      try {
        helper.value = window.location.href;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();

        const copied = document.execCommand("copy");
        showToast(copied
          ? "Link copiado para a área de transferência!"
          : "Não foi possível copiar. Use o endereço do navegador.");
      } catch {
        showToast("Não foi possível copiar. Use o endereço do navegador.");
      } finally {
        helper.remove();
      }
    }
  };

  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "Conheça o trabalho de Evan Lua, tatuador em Maceió.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          await copyCurrentUrl();
        }
      }
      return;
    }

    await copyCurrentUrl();
  });

  currentYear.textContent = new Date().getFullYear();
})();
