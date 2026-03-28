import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ open, title, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Delete "{title}"?</h3>
        <p>This action cannot be undone.</p>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
