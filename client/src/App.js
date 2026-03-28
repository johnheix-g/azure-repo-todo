import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [serviceUrl, setServiceUrl] = useState({
    url: "",
    reload: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setServiceUrl({
      url: API_URL,
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

  const handleDeleteTitle = (the, todo) => {
    console.log("the", the.target.dataset);
    const id = the.target.dataset.id;
    const title = the.target.dataset.title;
    // or
    //const id = todo.id;
    //const title = todo.title;

    const yesNo = window.confirm(
      `Are you sure you want to delete this title? ${todo.title}`,
      "",
    );
    if (yesNo) {
      fetch(serviceUrl.url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, title: title }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          console.log("DELETE response:", data.message);
          setMessage(data.message);
          setServiceUrl({ ...serviceUrl, reload: true });
        })
        .catch((error) => {
          setError(error.error);
          console.error("Error:", error.error);
        });
    }
  };

  return (
    <div id="content">
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
            <button
              data-id={todo.id}
              data-title={todo.title}
              onClick={(e) => handleDeleteTitle(e, todo)}
            >
              Delete
            </button>
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
    </div>
  );
}

export default App;
