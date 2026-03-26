import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(
      "https://todo-api-azure-g2djafc0d5gyc0bn.canadacentral-01.azurewebsites.net/todos",
    )
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

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
