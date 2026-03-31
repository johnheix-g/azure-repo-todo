import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ModalComponent from "./ModalComponent";
import { API_URL } from "./const";
import Header from "./Header";
import Body from "./Body";
import MemoBody from "./MemoBody";
import "./MemoList.css";
import MemoDetail from "./MemoDetail";

export default function MemoList() {
  const API = API_URL + "/memos";
  const [memos, setMemos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [editMemoOpen, setEditMemoOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [orderBy, setOrderBy] = useState("date");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadMemos = useCallback(async () => {
    const res = await fetch(
      `${API}?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}&search=${searchKeyword}`,
    );
    const data = await res.json();
    setMemos(data.data);
    setTotal(data.total);
  }, [page, pageSize, API, orderBy, orderDirection, searchKeyword]);

  useEffect(() => {
    const totalPages = Math.ceil(total / pageSize);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages); // Adjust page if it exceeds total pages after deletion
    }
  }, [total]);

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

  const handleOrder = (field) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("asc");
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
  };

  return (
    <div className="memo-container">
      <h1>Memo List</h1>

      <button
        title="Add New Memo"
        className="add-new"
        onClick={() => setEditMemoOpen(true)}
      >
        Add New Memo
      </button>

      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        onChange={(e) => handleSearch(e)}
      />

      <table className="memo-table">
        <thead>
          <tr>
            <th onClick={() => handleOrder("Type")}>
              Type{" "}
              {orderBy === "Type"
                ? orderDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : null}
            </th>
            <th onClick={() => handleOrder("Title")}>
              Title{" "}
              {orderBy === "Title"
                ? orderDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : null}
            </th>
            <th onClick={() => handleOrder("Date")}>
              Date{" "}
              {orderBy === "Date"
                ? orderDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : null}
            </th>
            <th onClick={() => handleOrder("Note")}>
              Note{" "}
              {orderBy === "Note"
                ? orderDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : null}
            </th>
            <th>Completed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {memos.map((m) => {
            return (
              <tr key={"mrmo-" + m.id}>
                <td>{m.type}</td>
                <td>
                  <button
                    title="View Details"
                    onClick={(e) => {
                      setDetailTarget(m);
                    }}
                  >
                    {m.title}
                  </button>
                </td>
                <td>{new Date(m.date).toISOString().split("T")[0]}</td>
                <td>{m.note}</td>
                <td>{m.completed ? "✔" : "✘"}</td>
                <td>
                  <button
                    title="Edit Memo"
                    className="btn btn-primary"
                    onClick={() => {
                      setEditTarget(m);
                      setEditMemoOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button
                    title="Delete Memo"
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
        {total > 0 && (
          <span className="total">
            Total: {total} {total > 1 ? "memos" : "memo"}
          </span>
        )}
      </div>

      {detailTarget && (
        <MemoDetail memo={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
      {editMemoOpen && (
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
      )}
      {deleteTarget && (
        <ConfirmModal
          open={!!deleteTarget}
          title={deleteTarget?.title}
          onConfirm={deleteMemo}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
