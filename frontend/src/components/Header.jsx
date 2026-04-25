import { memo, useContext, useState, useRef, useEffect } from "react";
import { StateContext } from "../context/StateProvider";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import translations from "../i18n/translations";
import { getCountryFlag } from "../i18n/countryLang";
import MegaMenu from "./MegaMenu";
import LogoutModal from "./LogoutModal";
import "./Header.css";
import "./LanguageSwitcher.css";

const Header = memo(function Header() {
  const { cart, user, lang, changeLang, t, detectedCountry } = useContext(StateContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const h = t.header;

  // Country flag — detected country ka, fallback current lang ka flag
  const countryFlag = detectedCountry
    ? getCountryFlag(detectedCountry)
    : translations[lang].flag;

  const [langOpen,    setLangOpen]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [logoutOpen,  setLogoutOpen]  = useState(false);
  const langRef = useRef(null);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mega menu on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setMenuOpen(false); setLogoutOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleLogoutConfirm = () => {
    signOut(auth);
    setLogoutOpen(false);
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-text">amazon<span>.in</span></span>
        </Link>

        {/* Deliver to */}
        <div className="header__deliver">
          <span className="header__deliver-top">{h.deliverTo}</span>
          <span className="header__deliver-bottom">📍 {h.deliverLocation}</span>
        </div>

        {/* Search */}
        <div className="header__search">
          <select className="header__search-select" aria-label="Search category">
            <option>{h.searchCategory}</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Fashion</option>
          </select>
          <input
            className="header__search-input"
            placeholder={h.searchPlaceholder}
            aria-label="Search products"
          />
          <button className="header__search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>

        <nav className="header__nav">
          {/* Language Switcher */}
          <div className="header__lang" ref={langRef}>
            <div className="header__nav-item" onClick={() => setLangOpen(!langOpen)}>
              <span className="header__nav-item-top">
                <span className="header__country-flag">{countryFlag}</span>
                &nbsp;{translations[lang].name}
              </span>
              <span className="header__nav-item-bottom">Language ▾</span>
            </div>
            {langOpen && (
              <div className="lang-dropdown">
                <div className="lang-dropdown__label">Common</div>
                <button
                  className={`lang-option ${lang === "en" ? "lang-option--active" : ""}`}
                  onClick={() => { changeLang("en"); setLangOpen(false); }}
                >
                  <span className="lang-flag">{translations["en"].flag}</span>
                  <span>{translations["en"].name}</span>
                </button>
                <div className="lang-dropdown__divider" />
                <div className="lang-dropdown__label">All Languages</div>
                {Object.entries(translations)
                  .filter(([code]) => code !== "en")
                  .map(([code, val]) => (
                    <button
                      key={code}
                      className={`lang-option ${lang === code ? "lang-option--active" : ""}`}
                      onClick={() => { changeLang(code); setLangOpen(false); }}
                    >
                      <span className="lang-flag">{val.flag}</span>
                      <span>{val.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Account / Sign Out */}
          {user ? (
            <div
              className="header__nav-item"
              onClick={() => setLogoutOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <span className="header__nav-item-top">{h.helloUser(user.email.split("@")[0])}</span>
              <span className="header__nav-item-bottom">{h.signOut}</span>
            </div>
          ) : (
            <Link to="/login" className="header__nav-item">
              <span className="header__nav-item-top">{h.helloSignIn}</span>
              <span className="header__nav-item-bottom">{h.accountLists} ▾</span>
            </Link>
          )}

          {/* Orders */}
          <Link to="/orders" className="header__nav-item">
            <span className="header__nav-item-top">{h.returns}</span>
            <span className="header__nav-item-bottom">{h.orders}</span>
          </Link>

          {/* Cart */}
          <Link to="/checkout" className="header__cart">
            <span className="header__cart-icon">🛒</span>
            {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
            <span className="header__cart-text">{h.cart}</span>
          </Link>
        </nav>
      </div>

      {/* Sub Header */}
      <div className="header__sub">
        <button
          className="header__sub-link header__sub-link--bold header__all-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open all categories"
        >
          ☰ All
        </button>
        {h.subLinks.map((link) => (
          <a key={link} href="#" className="header__sub-link">{link}</a>
        ))}
      </div>

      {/* Mega Menu */}
      {menuOpen && (
        <>
          <div className="megamenu-overlay" onClick={() => setMenuOpen(false)} />
          <MegaMenu onClose={() => setMenuOpen(false)} />
        </>
      )}

      {/* Logout Confirmation Modal */}
      {logoutOpen && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setLogoutOpen(false)}
        />
      )}
    </>
  );
});

export default Header;
