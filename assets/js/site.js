/* EnteleSCAN shared site utilities */
(function () {
  const mobileToggle = document.querySelector("[data-mobile-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const languageSelects = document.querySelectorAll("[data-language-select]");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const ENTELESCAN_LANGUAGES =
    "en,de,tr,fr,es,it,ru,pt,nl,pl,ar,zh-CN,ja,ko,hi,id,vi,th,uk,ro,el,sv,no,da,fi";
  const ENTELESCAN_LANGUAGE_KEY = "entelescan-language";

  function setTranslateCookie(language) {
    const value = language === "en" ? "/en/en" : `/en/${language}`;
    document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
    if (location.hostname && location.hostname.includes(".")) {
      document.cookie = `googtrans=${value};domain=.${location.hostname};path=/;SameSite=Lax`;
    }
  }

  function syncLanguageSelects(language) {
    languageSelects.forEach((select) => {
      select.value = language;
    });
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }

  function applyEnteleScanLanguage(language, persist = true, attempt = 0) {
    const selected = ENTELESCAN_LANGUAGES.split(",").includes(language) ? language : "en";
    syncLanguageSelects(selected);
    setTranslateCookie(selected);
    if (persist) localStorage.setItem(ENTELESCAN_LANGUAGE_KEY, selected);
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = selected === "en" ? "" : selected;
      combo.dispatchEvent(new Event("change"));
      return;
    }
    if (attempt < 20) {
      window.setTimeout(() => applyEnteleScanLanguage(selected, false, attempt + 1), 250);
    }
  }

  window.initEnteleScanTranslate = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: ENTELESCAN_LANGUAGES, autoDisplay: false },
        "google_translate_element"
      );
      const saved = localStorage.getItem(ENTELESCAN_LANGUAGE_KEY) || "en";
      window.setTimeout(() => applyEnteleScanLanguage(saved, false), 350);
    }
  };

  languageSelects.forEach((select) => {
    select.addEventListener("change", (event) => {
      applyEnteleScanLanguage(event.target.value);
    });
  });

  syncLanguageSelects(localStorage.getItem(ENTELESCAN_LANGUAGE_KEY) || "en");

  window.ENTELESCAN = {
    ENK_CONTRACT: "0xC95343B3f8A5af57a9b3B1acFf3D2a7654Fa28F6",
    ENK_MAX_SUPPLY: "100000000000",
    ENK_DECIMALS: 18,
    GENESIS_VAULT: "0x9c70957b7eae5b56c231e3cd61b067715692c477",
    short(value) {
      if (!value) return "";
      return value.slice(0, 6) + "..." + value.slice(-4);
    },
    formatAmount(value, decimals = 18, maximum = 4) {
      try {
        if (value === undefined || value === null || value === "") return "0";
        const raw = BigInt(String(value));
        const divisor = BigInt(10) ** BigInt(decimals);
        const whole = raw / divisor;
        const fraction = raw % divisor;
        if (maximum === 0 || fraction === 0n) return whole.toLocaleString("en-US");
        let frac = fraction
          .toString()
          .padStart(decimals, "0")
          .slice(0, maximum)
          .replace(/0+$/, "")
          .trim();
        return frac ? `${whole.toLocaleString("en-US")}.${frac}` : whole.toLocaleString("en-US");
      } catch {
        const amount = Number(value) / Math.pow(10, Number(decimals));
        return Number.isFinite(amount)
          ? amount.toLocaleString("en-US", { maximumFractionDigits: maximum })
          : String(value);
      }
    },
    escape(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])
      );
    },
  };
})();
