import { createContext, useReducer, useCallback, useMemo, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import translations from "../i18n/translations";

export const StateContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.findIndex((i) => i.id === action.item.id);
      const addQty = action.item.quantity ?? 1;
      if (existing >= 0) {
        return state.map((i, idx) =>
          idx === existing ? { ...i, quantity: i.quantity + addQty } : i
        );
      }
      return [...state, { ...action.item, quantity: addQty }];
    }
    case "REMOVE_FROM_CART":
      return state.filter((_, idx) => idx !== action.index);
    default:
      return state;
  }
};

function StateProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [detectedCountry, setDetectedCountry] = useState(null);

  const t = translations[lang] || translations.en;

  const changeLang = useCallback((code) => {
    setLang(code);
    localStorage.setItem("lang", code);
  }, []);

  // Detect country for flag display — but NEVER auto-change language
  // English is always the default until user manually selects
  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem("detectedCountry");
    if (cached) { setDetectedCountry(cached); return; }

    // Try ipapi.co first, fallback to ip-api.com
    const detect = async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        const d = await r.json();
        if (d.country_code) {
          setDetectedCountry(d.country_code);
          localStorage.setItem("detectedCountry", d.country_code);
          return;
        }
      } catch {}

      try {
        const r = await fetch("http://ip-api.com/json/?fields=countryCode");
        const d = await r.json();
        if (d.countryCode) {
          setDetectedCountry(d.countryCode);
          localStorage.setItem("detectedCountry", d.countryCode);
        }
      } catch {}
    };

    detect();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    dispatch({ type: "ADD_TO_CART", item });
  }, []);

  const removeFromCart = useCallback((index) => {
    dispatch({ type: "REMOVE_FROM_CART", index });
  }, []);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, user, authLoading, lang, t, changeLang, detectedCountry }),
    [cart, addToCart, removeFromCart, user, authLoading, lang, t, changeLang, detectedCountry]
  );

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
}

export default StateProvider;
