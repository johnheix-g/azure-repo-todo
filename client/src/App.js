import { useEffect, useState } from "react";

const URL = "https://gray-stone-0c7dad60f.2.azurestaticapps.net:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [url, setUrl] = useState(URL);
  const [reload, setReload] = useState(new Date());

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, [reload]);

  // Local
  // useEffect(() => {
  //   fetch("http://localhost:5000/todos")
  //     .then((res) => res.json())
  //     .then((data) => setTodos(data));
  // }, []);

  return (
    <div>
      <h1>Azure Todo App</h1>
      <p>
        Service URL: <span>{url}</span>
      </p>
      <P>
        <input
          type="text"
          id="service-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </P>
      <p>
        <button onClick={setReload(new Date())}>Reload</button>
      </p>
      {todos.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
}

export default App;
