const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "YOUR_USER",
  password: "YOUR_PASSWORD",
  server: "yourserver.database.windows.net",
  database: "tododb",
  options: { encrypt: true }
};

app.get("/todos", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Todos`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/todos", async (req, res) => {
  const { title } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Todos(title, completed)
      VALUES (${title}, 0)
    `;
    res.send("Todo created");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => console.log("API running"));
