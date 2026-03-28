const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://gray-stone-0c7dad60f.2.azurestaticapps.net",
    ],
  }),
);

app.use(express.json());

// //Azure
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
  },

  // user: "azure-sa",
  // password: "Nanping1993",
  // server: "my-todo-server.database.windows.net",
  // database: "free-sql-db-0341364",
  // options: { encrypt: true,trustServerCertificate: false },
};

// //local;
// const config = {
//   user: "sa",
//   password: "nanping93",
//   server: "localhost\\SQLEXPRESS",
//   database: "tododb",
//   options: {
//     encrypt: false, // turn off encryption for local SQLExpress
//     trustServerCertificate: true,
//   },
// };

app.get("/todos", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Todos`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  const { title, completed } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Todos(title, completed)
      VALUES (${title}, ${completed})
    `;
    res.send({ message: "Todo created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete("/todos", async (req, res) => {
  const { id, title } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM Todos WHERE id = ${id}
    `;
    res.send({ message: `${title} deleted` });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on port ${port}`));
