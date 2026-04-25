import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { StateContext } from "../context/StateProvider";
import "./Orders.css";

function Orders() {
  const { user, t } = useContext(StateContext);
  const o = t.orders;

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("created", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-layout">
          <div className="orders-main">
            <p style={{ color: "#565959", fontSize: 14 }}>{o.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-layout">
        <div className="orders-sidebar">
          <h3>{o.yourAccount}</h3>
          <Link to="/orders" className="orders-sidebar-link">{o.yourOrders}</Link>
          <a href="#" className="orders-sidebar-link">{o.yourProfile}</a>
          <a href="#" className="orders-sidebar-link">{o.prime}</a>
          <a href="#" className="orders-sidebar-link">{o.giftCards}</a>
          <a href="#" className="orders-sidebar-link">{o.customerService}</a>
        </div>

        <div className="orders-main">
          <h1>{o.title}</h1>

          <div className="orders-filter-bar">
            <span>{o.ordersPlaced(orders.length)}</span>
            <select aria-label="Filter by time">
              {o.filterOptions.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">
              <p>{o.noOrders}</p>
              <Link to="/">{o.startShopping}</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-header-col">
                    <span className="order-header-label">{o.orderPlaced}</span>
                    <span className="order-header-value">
                      {order.created?.toDate
                        ? order.created.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                        : "—"}
                    </span>
                  </div>
                  <div className="order-header-col">
                    <span className="order-header-label">{o.total}</span>
                    <span className="order-header-value">₹{order.total?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="order-header-col">
                    <span className="order-header-label">{o.shipTo}</span>
                    <span className="order-header-value">{o.you}</span>
                  </div>
                  <div className="order-id-col">
                    <div className="order-id-label">{o.orderNum} {order.id.slice(0, 14)}...</div>
                    <span className="order-id-value">{o.viewDetails}</span>
                  </div>
                </div>

                <div className="order-body">
                  <p className="order-status">{o.delivered}</p>
                  <div className="order-items-list">
                    {order.cart?.map((item, index) => (
                      <div key={index} className="order-item-row">
                        <span className="order-item-dot" />
                        <span className="order-item-name">{item.title}</span>
                        <span style={{ color: "#565959", fontSize: 13 }}>× {item.quantity ?? 1}</span>
                        <span className="order-item-price">₹{item.price?.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
