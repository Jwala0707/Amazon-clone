import { memo, useContext, useState } from "react";
import { StateContext } from "../context/StateProvider";
import "./Product.css";

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars" aria-label={`Rating: ${rating}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "star star--full" : i === full && half ? "star star--half" : "star"}>★</span>
      ))}
      <span className="rating-num">1,234</span>
    </div>
  );
};

const Product = memo(function Product({ id, title, price, image, rating }) {
  const { addToCart, t } = useContext(StateContext);
  const p = t.product;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const originalPrice = Math.round(price * 1.3);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleAdd = () => {
    addToCart({ id, title, price, image, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product">
      {discount > 0 && <span className="product-badge">{discount}% off</span>}

      <div className="product-img-wrap">
        <img src={image} alt={title} loading="lazy" className="product-img" />
      </div>

      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        {rating && <StarRating rating={rating} />}

        <div className="price-row">
          <span className="price-symbol">₹</span>
          <span className="price">{price.toLocaleString("en-IN")}</span>
          <span className="price-original">₹{originalPrice.toLocaleString("en-IN")}</span>
          <span className="price-discount">({discount}% off)</span>
        </div>

        <p className="product-delivery">{p.freeDelivery}</p>

        <div className="qty-row">
          <span className="qty-label">{p.qty}</span>
          <select className="qty-select" value={qty} onChange={(e) => setQty(Number(e.target.value))} aria-label="Select quantity">
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button className={`add-btn ${added ? "add-btn--added" : ""}`} onClick={handleAdd}>
          {added ? p.added : p.addToCart}
        </button>
      </div>
    </div>
  );
});

export default Product;
