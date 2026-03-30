import "./Footer.css";

export default function Footer({
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
}) {
  const confirmClass = confirmText === "Delete" ? "btn-delete" : "btn-submit";
  return (
    <div className="modal-buttons">
      <button className="btn-cancel" onClick={onCancel}>
        {cancelText || "Cancel"}
      </button>
      <button className={confirmClass} onClick={onConfirm}>
        {confirmText || "Delete"}
      </button>
    </div>
  );
}
