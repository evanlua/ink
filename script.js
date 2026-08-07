(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#themeToggle");
  const shareButton = document.querySelector("#shareButton");
  const currentYear = document.querySelector("#currentYear");
  const toast = document.querySelector("#toast");
  const toastMessage = document.querySelector("#toastMessage");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    themeColor.setAttribute("content", isDark ? "#0d090a" : "#f2ece7");
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

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px" },
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion.matches) {
    window.addEventListener("pointermove", (event) => {
      const x = `${Math.round((event.clientX / window.innerWidth) * 100)}%`;
      const y = `${Math.round((event.clientY / window.innerHeight) * 100)}%`;
      document.body.style.setProperty("--pointer-x", x);
      document.body.style.setProperty("--pointer-y", y);
    }, { passive: true });
  }

  currentYear.textContent = new Date().getFullYear();
})();
