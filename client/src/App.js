import { useState } from "react";
import MemoList from "./MemoList";
import TodoExample from "./TodoExample";
import "./App.css";

const Button = {
  TODO: "TODO",
  MEMO: "MEMO",
};

function App() {
  const [todo, setTodo] = useState(false);
  const [memo, setMemo] = useState(false);

  const setAll = (btn) => {
    if (btn === Button.TODO) {
      setTodo(true);
      setMemo(false);
    } else if (btn === Button.MEMO) {
      setTodo(false);
      setMemo(true);
    }
  };

  return (
    <div id="content">
      <button className="button" onClick={() => setAll(Button.TODO)}>
        Todo List
      </button>
      <button className="button" onClick={() => setAll(Button.MEMO)}>
        Memo List
      </button>
      {todo ? <TodoExample /> : memo ? <MemoList /> : null}
    </div>
  );
}

export default App;
