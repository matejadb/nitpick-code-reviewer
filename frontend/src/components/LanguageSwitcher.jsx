import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", label: "English" },

    { code: "sr", label: "Srpski" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-inter text-neutral-0 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-neutral-800"
        title="Change language"
      >
        <span>{currentLanguage?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-neutral-700 bg-neutral-900 py-2 shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`font-inter w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
                i18n.language === lang.code
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
