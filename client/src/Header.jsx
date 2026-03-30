export default function Header({ header, onCancel }) {
  return (
    <>
      <strong>{header}</strong>

      {/* Top-right close button */}
      <button className="modal-close-btn" onClick={onCancel}>
        ✕
      </button>
    </>
  );
}
