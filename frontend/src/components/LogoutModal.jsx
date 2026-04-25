import "./LogoutModal.css";

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="logout-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal__icon">👋</div>
        <h2 className="logout-modal__title">Sign Out</h2>
        <p className="logout-modal__text">
          Are you sure you want to sign out of your Amazon account?
        </p>
        <div className="logout-modal__actions">
          <button className="logout-modal__btn logout-modal__btn--confirm" onClick={onConfirm}>
            Yes, Sign Out
          </button>
          <button className="logout-modal__btn logout-modal__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
