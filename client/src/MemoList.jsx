import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ModalComponent from "./ModalComponent";
import { API_URL } from "./const";
import Header from "./Header";
import Body from "./Body";
import MemoBody from "./MemoBody";
import "./MemoList.css";

export default function MemoList() {
  const API = API_URL + "/memos";
  const [memos, setMemos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [editMemoOpen, setEditMemoOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const loadMemos = useCallback(async () => {
    const res = await fetch(`${API}?page=${page}&pageSize=${pageSize}`);
    const data = await res.json();
    setMemos(data.data);
    setTotal(data.total);
  }, [page, pageSize, API]);

  useEffect(() => {
    loadMemos();
  }, [loadMemos]);

  const deleteMemo = async () => {
    await fetch(`${API}/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    loadMemos();
  };

  const handleSubmit = async (memo) => {
    const method = editTarget ? "PUT" : "POST";
    const url = editTarget ? `${API}/${memo.id}` : API;
    await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memo),
    });
    setEditMemoOpen(false);
    loadMemos();
    setEditTarget(null);
  };

  const handleClose = () => {
    setEditMemoOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="memo-container">
      <h1>Memo List</h1>

      <button className="add-new" onClick={() => setEditMemoOpen(true)}>
        Add New Memo
      </button>

      <table className="memo-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Date</th>
            <th>Note</th>
            <th>Completed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {memos.map((m) => {
            return (
              <tr key={"mrmo-" + m.id}>
                <td>{m.type}</td>
                <td>{m.title}</td>
                <td>{new Date(m.date).toISOString().split("T")[0]}</td>
                <td>{m.note}</td>
                <td>{m.completed ? "✔" : "✘"}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditTarget(m);
                      setEditMemoOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-danger"
                    onClick={() => setDeleteTarget(m)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => (
          <button
            key={"p" + i}
            className={page === i + 1 ? "page active" : "page"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <ModalComponent
        open={editMemoOpen}
        Header={
          <Header
            header={editTarget ? "Edit Memo" : "Add New Memo"}
            onCancel={() => handleClose()}
          />
        }
        Body={
          <Body
            title={editTarget ? "Edit Memo" : "Add New Memo"}
            message={
              <MemoBody
                onSubmit={handleSubmit}
                onClose={() => handleClose()}
                initialData={editTarget}
              />
            }
          />
        }
      />

      <ConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.title}
        onConfirm={deleteMemo}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
