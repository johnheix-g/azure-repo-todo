import { useState } from "react";
import MemoList from "./MemoList";
import "./App.css";

const Menu = {
  TODO: "TODO",
  MEMO: "MEMO",
};

function App() {
  const [menu, setMenu] = useState("");

  return (
    <div id="content">
      <button
        title="Memo Management"
        className="button"
        onClick={() => setMenu(Menu.MEMO)}
      >
        Memo Management
      </button>
      {menu === Menu.MEMO && <MemoList />}
    </div>
  );
}

export default App;
