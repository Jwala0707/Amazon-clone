import { lazy, Suspense, useContext } from "react";
import Header from "./components/Header";
import LangBanner from "./components/LangBanner";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StateContext } from "./context/StateProvider";
import "./App.css";

const Home     = lazy(() => import("./Pages/Home"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const Payment  = lazy(() => import("./Pages/Payment"));
const Orders   = lazy(() => import("./Pages/Orders"));
const Login    = lazy(() => import("./Pages/Login"));

function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(StateContext);
  const location = useLocation();
  if (authLoading) return <div className="page-loader">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function Footer() {
  const { t } = useContext(StateContext);
  const f = t.footer;
  return (
    <>
      <div className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        {f.backToTop}
      </div>
      <div className="footer">
        <div className="footer-logo">{f.logo}<span>.in</span></div>
        <div className="footer-links">
          {f.links1.map((l) => <a key={l} href="#">{l}</a>)}
        </div>
        <div className="footer-links">
          {f.links2.map((l) => <a key={l} href="#">{l}</a>)}
        </div>
        <div className="footer-links" style={{ marginTop: 16 }}>
          {f.links3.map((l) => <a key={l} href="#">{l}</a>)}
        </div>
        <p style={{ marginTop: 12 }}>{f.copyright}</p>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <LangBanner />
      <Suspense fallback={<div className="page-loader">Loading...</div>}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment"  element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;