import { useContext, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { StateContext } from "../context/StateProvider";
import "./Login.css";

// step: "ask" | "login" | "signup"

function Login() {
  const [step, setStep]         = useState("ask");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { user, t } = useContext(StateContext);
  const l = t.login;
  const navigate   = useNavigate();
  const location   = useLocation();
  const redirectTo = location.state?.from || "/";

  if (user) { navigate(redirectTo, { replace: true }); return null; }

  const getError = (code) => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential": return l.errors.invalidCredential;
      case "auth/email-already-in-use": return l.errors.emailInUse;
      case "auth/weak-password": return l.errors.weakPassword;
      case "auth/invalid-email": return l.errors.invalidEmail;
      default: return l.errors.default;
    }
  };

  const handleAuth = async () => {
    setError("");
    if (!email || !password) { setError(l.errors.emptyFields); return; }
    if (step === "signup" && !name.trim()) { setError("Please enter your name."); return; }
    setLoading(true);
    try {
      if (step === "login") await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(getError(e.code));
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 1: Ask ── */
  if (step === "ask") {
    return (
      <div className="login-page">
        <div className="login-logo">amazon<span>.in</span></div>

        <div className="login login--ask">
          <div className="ask-icon">👤</div>
          <h1>Welcome to Amazon</h1>
          <p className="ask-subtitle">Do you already have an Amazon account?</p>

          <div className="ask-actions">
            <button className="login-btn ask-btn" onClick={() => setStep("login")}>
              ✅ Yes, Sign In
            </button>
            <button className="login-create-btn ask-btn" onClick={() => setStep("signup")}>
              🆕 No, Create Account
            </button>
          </div>
        </div>

        <div className="login-bottom">
          <a href="#">{l.conditionsOfUse}</a> &nbsp;·&nbsp;
          <a href="#">{l.privacyNotice}</a> &nbsp;·&nbsp;
          <a href="#">{l.help}</a>
          <p style={{ marginTop: 8 }}>{l.copyright}</p>
        </div>
      </div>
    );
  }

  /* ── STEP 2: Login or Signup form ── */
  return (
    <div className="login-page">
      <div className="login-logo">amazon<span>.in</span></div>

      <div className="login">
        {/* Back button */}
        <button className="login-back" onClick={() => { setStep("ask"); setError(""); }}>
          ← Back
        </button>

        <h1>{step === "login" ? l.signIn : l.createAccount}</h1>

        {error && <p className="login-error">{error}</p>}

        {/* Name field — only for signup */}
        {step === "signup" && (
          <div className="login-input-wrap">
            <label className="login-label" htmlFor="name">Your name</label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="First and last name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="login-input-wrap">
          <label className="login-label" htmlFor="email">{l.email}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-input-wrap">
          <label className="login-label" htmlFor="password">{l.password}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
        </div>

        <button className="login-btn" disabled={loading} onClick={handleAuth}>
          {loading ? l.pleaseWait : step === "login" ? l.continue : l.createAccount}
        </button>

        <p className="login-terms">
          {l.terms1} <a href="#">{l.conditionsOfUse}</a> {l.and} <a href="#">{l.privacyNotice}</a>.
        </p>

        {/* Switch between login / signup */}
        <div className="login-divider">
          <span>{step === "login" ? l.newToAmazon : "Already have an account?"}</span>
        </div>

        <button
          className="login-create-btn"
          disabled={loading}
          onClick={() => { setStep(step === "login" ? "signup" : "login"); setError(""); }}
        >
          {step === "login" ? l.createAccount : l.signIn}
        </button>
      </div>

      <div className="login-bottom">
        <a href="#">{l.conditionsOfUse}</a> &nbsp;·&nbsp;
        <a href="#">{l.privacyNotice}</a> &nbsp;·&nbsp;
        <a href="#">{l.help}</a>
        <p style={{ marginTop: 8 }}>{l.copyright}</p>
      </div>
    </div>
  );
}

export default Login;
