import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import { saveOrder } from "../utils/firebaseFunctions";
import "./Payment.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Payment() {
  const { cart, user, t } = useContext(StateContext);
  const p = t.payment;

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const total     = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (total <= 0) return;
    axios.post(`${API_URL}/payment`, { amount: total * 100 })
      .catch(() => {}); // mock server — error ignore
  }, [total]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      await saveOrder(cart, total, user?.uid);
      setSuccess(true);
    } catch {
      setError(p.errorPayment);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-page">
        <div className="payment-success">
          <div className="payment-success-icon">✅</div>
          <h2>{p.successTitle}</h2>
          <p>{p.successDesc}</p>
          <Link to="/" className="payment-success-link">{p.continueShopping}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h1>{p.title(itemCount)}</h1>

      <div className="payment-layout">
        <div className="payment-form-section">
          <p className="payment-section-title">{p.reviewItems}</p>
          <div className="payment-items">
            {cart.map((item) => (
              <div key={item.id} className="payment-item">
                <span className="payment-item-name">{item.title}</span>
                <span className="payment-item-qty">× {item.quantity}</span>
                <span className="payment-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="payment-summary">
          <div className="payment-summary-box">
            <p className="payment-summary-title">{p.orderSummary}</p>
            <div className="payment-summary-row">
              <span>{p.items(itemCount)}</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="payment-summary-row">
              <span>{p.delivery}</span>
              <span style={{ color: "#007600" }}>{p.free}</span>
            </div>
            <div className="payment-summary-total">
              <span>{p.orderTotal}</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <p className="payment-summary-free">{p.freeDeliveryNote}</p>

            {error && <p className="payment-error">{error}</p>}

            <button className="pay-btn" onClick={handlePayment} disabled={loading || cart.length === 0}>
              {loading ? p.processing : p.placeOrder}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
