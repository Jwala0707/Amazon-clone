import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../context/StateProvider";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import LogoutModal from "./LogoutModal";
import "./MegaMenu.css";

const menuData = [
  {
    heading: "Trending",
    items: [
      { label: "Bestsellers",        icon: "🏆" },
      { label: "New Releases",       icon: "🆕" },
      { label: "Movers and Shakers", icon: "📈" },
    ],
  },
  {
    heading: "Digital Content & Devices",
    items: [
      { label: "Echo & Alexa",              icon: "🔊" },
      { label: "Fire TV",                   icon: "📺" },
      { label: "Kindle E-Readers & eBooks", icon: "📖" },
      { label: "Audible Audiobooks",        icon: "🎧" },
      { label: "Amazon Prime Video",        icon: "🎬" },
      { label: "Amazon Prime Music",        icon: "🎵" },
    ],
  },
  {
    heading: "Shop by Category",
    items: [
      { label: "Mobiles, Computers",          icon: "📱" },
      { label: "TV, Appliances, Electronics", icon: "🖥️" },
      { label: "Men's Fashion",               icon: "👔" },
      { label: "Women's Fashion",             icon: "👗" },
      { label: "See all",                     icon: "›", seeAll: true },
    ],
  },
  {
    heading: "Programs & Features",
    items: [
      { label: "Gift Cards & Mobile Recharges", icon: "🎁" },
      { label: "Amazon Launchpad",              icon: "🚀" },
      { label: "Amazon Business",               icon: "💼" },
      { label: "Handloom and Handicrafts",      icon: "🧵" },
      { label: "See all",                       icon: "›", seeAll: true },
    ],
  },
];

function MegaMenu({ onClose }) {
  const { user } = useContext(StateContext);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    signOut(auth);
    setLogoutOpen(false);
    onClose();
  };

  return (
    <>
      <div className="megamenu" role="dialog" aria-label="All categories menu">
        {/* Header strip */}
        <div className="megamenu__header">
          {user ? (
            <span className="megamenu__greeting">
              Hello, {user.email.split("@")[0]}
            </span>
          ) : (
            <Link to="/login" className="megamenu__signin" onClick={onClose}>
              Hello, Sign in
            </Link>
          )}
        </div>

        {/* Sections */}
        <div className="megamenu__body">
          {menuData.map((section) => (
            <div key={section.heading} className="megamenu__section">
              <h3 className="megamenu__section-title">{section.heading}</h3>
              <ul className="megamenu__list">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href="#"
                      className={`megamenu__item ${item.seeAll ? "megamenu__item--see-all" : ""}`}
                      onClick={onClose}
                    >
                      <span className="megamenu__item-icon">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer: Help & Settings */}
        <div className="megamenu__footer">
          <h3 className="megamenu__section-title">Help &amp; Settings</h3>
          <ul className="megamenu__list">
            <li>
              <Link to="/orders" className="megamenu__item" onClick={onClose}>
                <span className="megamenu__item-icon">📦</span> Your Account
              </Link>
            </li>
            <li>
              <a href="#" className="megamenu__item" onClick={onClose}>
                <span className="megamenu__item-icon">🎧</span> Customer Service
              </a>
            </li>
            {user ? (
              <li>
                <a
                  href="#"
                  className="megamenu__item"
                  onClick={(e) => { e.preventDefault(); setLogoutOpen(true); }}
                >
                  <span className="megamenu__item-icon">🚪</span> Sign Out
                </a>
              </li>
            ) : (
              <li>
                <Link to="/login" className="megamenu__item" onClick={onClose}>
                  <span className="megamenu__item-icon">👤</span> Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Logout Modal — inside MegaMenu so it renders on top */}
      {logoutOpen && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setLogoutOpen(false)}
        />
      )}
    </>
  );
}

export default MegaMenu;
