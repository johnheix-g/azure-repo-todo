import { useEffect, useState } from "react";
import ModalComponent from "./ModalComponent";
import { API_URL } from "./const";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

function App() {
  const API = API_URL + "/todos";
  const [todos, setTodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [serviceUrl, setServiceUrl] = useState({
    url: "",
    reload: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setServiceUrl({
      url: API,
      reload: true,
    });
  }, []);

  useEffect(() => {
    if (serviceUrl.reload) {
      setServiceUrl({ ...serviceUrl, reload: false });

      fetch(serviceUrl.url)
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }
  }, [serviceUrl]);

  useEffect(() => {
    console.log("Todos", todos);
  }, [todos]);

  const setUrl = (e) => {
    setServiceUrl({ ...serviceUrl, url: e.target.value });
  };

  const setReload = () => {
    setServiceUrl({ ...serviceUrl, reload: true });
  };

  const addNew = () => {
    const title = document.getElementById("title").value.trim();
    if (title.length === 0) {
      setError("Title cannot be empty!");
      return;
    }
    const existingTitles = todos.map((todo) => todo.title);
    if (existingTitles.includes(title)) {
      setError("Please enter an unique title!");
      return;
    }
    const completed = document.getElementById("completed").checked;
    fetch(serviceUrl.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, completed: completed }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("POST response:", data.message);
        setMessage(data.message);
        setServiceUrl({ ...serviceUrl, reload: true });
      })
      .catch((error) => {
        setError(error.error);
        console.error("Error:", error.error);
      });
  };

  const emptyMessage = () => {
    setError("");
    setMessage("");
  };

  const openDeleteModal = (todo) => {
    setTodoToDelete(todo);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todoToDelete.id, title: todoToDelete.title }),
    });

    setTodos(todos.filter((t) => t.id !== todoToDelete.id));
    setModalOpen(false);
  };

  return (
    <div id="content">
      <div className="subtitle">Built with Azure SQL and Azure App Service</div>
      <hr />
      <div className="description">
        This is a simple Todo application built using React for the frontend and
        Node.js with Express for the backend. It connects to an Azure SQL
        database to store and manage todo items. You can add new todos, mark
        them as completed, and delete them. The app demonstrates how to
        integrate Azure services into a full-stack application, making it a
        great starting point for learning about Azure's capabilities in web
        development. Feel free to explore the code and customize it to your
        needs!
      </div>
      <h1>Azure Todo App</h1>
      <p>Service URL: {serviceUrl.url}</p>

      <div>
        <input
          name="url"
          id="url"
          type="text"
          value={serviceUrl.url}
          onChange={(e) => setUrl(e)}
        />
        <button id="reload" onClick={() => setReload()}>
          Reload
        </button>
      </div>
      <hr />
      <div id="error">{error}</div>
      <label htmlFor="completed">Completed</label>
      <input
        type="checkbox"
        name="completed"
        id="completed"
        onChange={() => emptyMessage()}
      />
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        onChange={() => emptyMessage()}
      />
      <button id="add" onClick={() => addNew()}>
        Add New
      </button>
      <div id="message">{message}</div>

      {todos.map((todo) => (
        <div key={todo.id}>
          <span className="delete">
            <button onClick={() => openDeleteModal(todo)}>Delete</button>
            {/* <button
              data-id={todo.id}
              data-title={todo.title}
              onClick={(e) => handleDeleteTitle(e, todo)}
            >
              Delete
            </button> */}
          </span>
          <span
            className="completed"
            title={todo.completed ? "Completed" : "Uncompleted"}
          >
            {todo.completed ? "C" : "U"}
          </span>
          <span className="title">{todo.title}</span>
        </div>
      ))}
      <ModalComponent
        open={modalOpen}
        Header={
          <Header
            header="Confirm Delete"
            onCancel={() => setModalOpen(false)}
          />
        }
        Body={
          <Body
            title={'Delete "' + todoToDelete?.title + '"?'}
            message="This action cannot be undone."
          />
        }
        Footer={
          <Footer
            onCancel={() => setModalOpen(false)}
            onConfirm={confirmDelete}
            cancelText="Cancel"
            confirmText="Delete"
          />
        }
      />
    </div>
  );
}

export default App;
