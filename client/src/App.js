import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://gray-stone-0c7dad60f.2.azurestaticapps.net/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  // Local
  // useEffect(() => {
  //   fetch("http://localhost:5000/todos")
  //     .then((res) => res.json())
  //     .then((data) => setTodos(data));
  // }, []);

  return (
    <div>
      <h1>Azure Todo App</h1>

      {todos.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
}

export default App;
