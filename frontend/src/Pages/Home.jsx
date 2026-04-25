import { useContext, useState } from "react";
import Product from "../components/Product";
import products from "../data/products";
import { StateContext } from "../context/StateProvider";
import "./Home.css";

const dealCardKeys = ["Electronics", "Fashion", "Home & Kitchen", "Books"];
const dealCardImgs = {
  "Electronics":    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
  "Fashion":        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
  "Home & Kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "Books":          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
};

const categoryKeys = ["All", "Electronics", "Fashion", "Home"];

function Home() {
  const { t } = useContext(StateContext);
  const h = t.home;

  const [activeCategoryKey, setActiveCategoryKey] = useState("All");

  const filtered =
    activeCategoryKey === "All"
      ? products
      : products.filter((p) => p.category === activeCategoryKey);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80"
          alt="Amazon Sale Banner"
          className="hero-img"
        />
        <div className="hero-fade" />
      </div>

      {/* Deal Cards */}
      <div className="deal-cards">
        {dealCardKeys.map((key) => (
          <div className="deal-card" key={key}>
            <h3>{h.dealTitles[key]}</h3>
            <img src={dealCardImgs[key]} alt={key} className="deal-card-img" />
            <span className="deal-card-link">{h.seeMore}</span>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="category-bar">
        {categoryKeys.map((key) => (
          <button
            key={key}
            className={`cat-btn ${activeCategoryKey === key ? "cat-btn--active" : ""}`}
            onClick={() => setActiveCategoryKey(key)}
          >
            {h.categories[key]}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="section-header">
        <h2>{activeCategoryKey === "All" ? h.allProducts : h.categories[activeCategoryKey]}</h2>
        <span className="product-count">{filtered.length} {h.results}</span>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filtered.map((item) => (
          <Product key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Home;
