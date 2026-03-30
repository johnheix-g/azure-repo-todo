import "./MemoDetailBody.css";

export default function MemoDetailBody({ memo }) {
  return (
    <div className="memo-detail">
      <label>
        <span className="label">Type</span>
        <span>{memo.type}</span>
      </label>
      <label>
        <span className="label">Title</span>
        <span>{memo.title}</span>
      </label>
      <label>
        <span className="label">Date</span>
        <span>{new Date(memo.date).toISOString().split("T")[0]}</span>
      </label>
      <label>
        <span className="label">Note</span>
        <span>{memo.note}</span>
      </label>
      <label className="checkbox-row">
        <input
          className="label"
          type="checkbox"
          checked={memo.completed}
          readOnly
        />
        <span className="label">Completed</span>
      </label>{" "}
    </div>
  );
}
