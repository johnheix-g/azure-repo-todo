import { useEffect, useState } from "react";
import Footer from "./Footer";
import "./MemoBody.css";

const TYPE_OPTIONS = ["Job", "Memo", "Website", "Other"];

export default function MemoBody({ onSubmit, onClose, initialData = null }) {
  const [id, setId] = useState(null);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  // Close on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (initialData) {
      console.log("Initial Data", initialData.date);
      setId(initialData.id);
      setType(initialData.type);
      setTitle(initialData.title);
      setDate(new Date(initialData.date).toISOString().split("T")[0]);
      setNote(initialData.note);
      setCompleted(initialData.completed);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !title || !date) {
      setError("Please fill in all required fields.");
      return;
    }

    onSubmit({ id, type, title, date, note, completed });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-form">
      <label>
        <span className="label">
          Type
          <span className="required">*</span>
        </span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="label">
          Title
          <span className="required">*</span>
        </span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        <span className="label">
          Date
          <span className="required">*</span>
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        <span className="label">Note</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      {error && <span className="error">{error}</span>}

      <Footer
        onCancel={() => handleCancel()}
        onConfirm={(e) => handleSubmit(e)}
        cancelText="Cancel"
        confirmText={id ? "Update" : "Submit"}
      />
    </div>
  );
}
