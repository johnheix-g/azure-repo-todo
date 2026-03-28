const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file
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

const runningInAzure = !!process.env.WEBSITE_SITE_NAME;

if (runningInAzure) {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });
}

/**
 * Azure database config - use environment variables for security
 * Make sure to set these in your local .env file and in Azure App Service Configuration
 * SQL_USER, SQL_PASSWORD, SQL_SERVER, SQL_DATABASE
 *
 * For local development, you can use a SQLExpress instance and set the config accordingly in .env.development
 * For Azure deployment, set the config in .env.production and make sure to add the corresponding Application Settings in Azure App Service
 */
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: runningInAzure, // encrypt in Azure, no encryption for local SQLExpress
    trustServerCertificate: !runningInAzure, // trust server certificate for local development
  },
};

console.log("Running in Azure:", runningInAzure);
console.log(
  "Using DB config:",
  runningInAzure ? "Azure SQL" : "Local SQLExpress",
);
module.exports = config; // Export config for testing purposes

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL");
    return pool;
  })
  .catch((err) => console.log("SQL Connection Error", err));

app.get("/todos", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Todos");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query`
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
    const pool = await poolPromise;
    const result = await pool.request().query`
      DELETE FROM Todos WHERE id = ${id}
    `;

    res.send({ message: `${title} deleted` });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// for Azure Static Web Apps health check
// Go to App Service → Health Check → Path: /health
app.get("/health", (req, res) => {
  res.send("OK");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on port ${port}`));
