import { useContext } from "react";
import { StateContext } from "../context/StateProvider";
import { Link } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cart, removeFromCart, t } = useContext(StateContext);
  const c = t.checkout;

  const total     = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>{c.emptyTitle}</h2>
          <p>{c.emptyDesc}</p>
          <Link to="/">{c.continueShopping}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>{c.title}</h1>

      <div className="checkout-layout">
        <div className="checkout-items">
          <div className="checkout-items-title">{c.price}</div>

          {cart.map((item, index) => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.title} className="checkout-item-img" />
              <div className="checkout-item-details">
                <p className="checkout-item-title">{item.title}</p>
                <p className="checkout-item-stock">{c.inStock}</p>
                <p className="checkout-item-qty">{c.qty} {item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(index)}>{c.delete}</button>
              </div>
              <p className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}

          <div className="checkout-subtotal">
            {c.subtotal(itemCount)}&nbsp;<strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="checkout-summary">
          <p className="checkout-summary-savings">{c.freeDelivery}</p>
          <p className="checkout-summary-title">{c.subtotal(itemCount)}</p>
          <div className="checkout-summary-total">
            <span>{c.orderTotal}</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <Link to="/payment" className="proceed-btn">{c.proceedToBuy}</Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
