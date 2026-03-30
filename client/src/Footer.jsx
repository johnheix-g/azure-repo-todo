import "./Footer.css";

export default function Footer({
  onCancel = null,
  onConfirm = null,
  cancelText = "Cancel",
  confirmText = "Delete",
}) {
  const confirmClass = confirmText === "Delete" ? "btn-delete" : "btn-submit";
  return (
    <>
      {(onCancel || onConfirm) && (
        <div className="modal-buttons">
          {onCancel && (
            <button className="btn-cancel" onClick={onCancel}>
              {cancelText || "Cancel"}
            </button>
          )}
          {onConfirm && (
            <button className={confirmClass} onClick={onConfirm}>
              {confirmText || "Delete"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
