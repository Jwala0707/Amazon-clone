import { useContext, useState } from "react";
import { StateContext } from "../context/StateProvider";
import translations from "../i18n/translations";
import { getLangForCountry } from "../i18n/countryLang";
import "./LangBanner.css";

function LangBanner() {
  const { lang, changeLang, detectedCountry } = useContext(StateContext);
  const [dismissed, setDismissed] = useState(false);

  // Show only if:
  // 1. Country was detected
  // 2. Suggested lang differs from current
  // 3. User hasn't dismissed
  // 4. User hasn't manually saved a lang preference
  const suggestedLang = getLangForCountry(detectedCountry);
  const userSavedLang = localStorage.getItem("lang");

  if (
    !detectedCountry ||
    suggestedLang === lang ||
    suggestedLang === "en" ||
    dismissed ||
    userSavedLang
  ) return null;

  const suggested = translations[suggestedLang];
  const current   = translations[lang];

  const handleSwitch = () => {
    changeLang(suggestedLang);
    setDismissed(true);
  };

  const handleKeep = () => {
    changeLang("en"); // lock to English
    setDismissed(true);
  };

  return (
    <div className="lang-banner">
      <span className="lang-banner__flag">{suggested.flag}</span>
      <p className="lang-banner__text">
        We noticed you're visiting from <strong>{detectedCountry}</strong>.
        Would you like to switch to <strong>{suggested.name}</strong>?
      </p>
      <div className="lang-banner__actions">
        <button className="lang-banner__btn lang-banner__btn--primary" onClick={handleSwitch}>
          Switch to {suggested.name} {suggested.flag}
        </button>
        <button className="lang-banner__btn lang-banner__btn--secondary" onClick={handleKeep}>
          Keep English 🇺🇸
        </button>
      </div>
      <button className="lang-banner__close" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
    </div>
  );
}

export default LangBanner;
