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
console.log("SQL_USER:", process.env.SQL_USER);
console.log("SQL_SERVER:", process.env.SQL_SERVER);
console.log("SQL_DATABASE:", process.env.SQL_DATABASE);
console.log("SQL_PASSWORD:", process.env.SQL_PASSWORD);

console.log("Running in Azure:", runningInAzure);
console.log(
  "Using DB config:",
  runningInAzure ? "Azure SQL" : "Local SQLExpress",
);
// below line is not working on Azure, it makes config undefined
// module.exports = config; // Export config for testing purposes

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

/**
 * Below are the new endpoints for the Memo feature. They follow RESTful conventions and include pagination for the GET endpoint.
 * Make sure to test these endpoints using Postman or a similar tool, and update the client-side code to interact with them.
 */
// Memos GET endpoint with pagination /memos?page=1&pageSize=10
app.get("/memos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const orderBy = req.query.orderBy || "date"; // Default order by date
  const orderDirection = req.query.orderDirection === "asc" ? "ASC" : "DESC"; // Default to DESC
  const search = req.query.search ? req.query.search.toLowerCase() : ""; // Search keyword

  console.log(
    `Fetching memos - Page: ${page}, Page Size: ${pageSize}, Offset: ${offset}`,
  );
  try {
    const pool = await poolPromise;
    /*
    const result = await pool.request().query(`
      SELECT *
      FROM Memos
            WHERE LOWER(title) LIKE '%${search}%' OR LOWER(note) LIKE '%${search}%' OR LOWER(type) LIKE '%${search}%' or date LIKE '%${search}%'
      ORDER BY ${orderBy} ${orderDirection}
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;

            SELECT COUNT(*) AS total FROM Memos
      WHERE LOWER(title) LIKE '%${search}%' OR LOWER(note) LIKE '%${search}%' OR LOWER(type) LIKE '%${search}%' or date LIKE '%${search}%';
    `);
    /**
 */
    const result = await pool
      .request()
      .input("search", sql.VarChar, `%${search}%`)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize).query(`
    SELECT *
    FROM Memos
    WHERE 
      title LIKE @search OR
      note LIKE @search OR
      type LIKE @search OR
      CONVERT(VARCHAR(10), date, 120) LIKE @search
    ORDER BY ${orderBy} ${orderDirection}
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    SELECT COUNT(*) AS total
    FROM Memos
    WHERE 
      title LIKE @search OR
      note LIKE @search OR
      type LIKE @search OR
      CONVERT(VARCHAR(10), date, 120) LIKE @search;
  `);
    /*
     */
    res.json({
      data: result.recordsets[0],
      pagination: {
        total: result.recordsets[1][0].total,
        page,
        pageSize,
      },
    });
  } catch (err) {
    console.log("Error fetching memos", err);
    res.status(500).send({ error: err.message });
  }
});

// Memos POST Add new memo /memos
app.post("/memos", async (req, res) => {
  const { type, title, date, note, completed } = req.body;
  console.log("Creating memo with data:", req.body);
  try {
    const pool = await poolPromise;
    await pool.request().query`
      INSERT INTO Memos(type, title, date, note, completed)
      VALUES (${type}, ${title}, ${date}, ${note}, ${completed})
    `;
    res.send({ message: "Memo created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Memos PUT /memos/:id (Edit)
app.put("/memos/:id", async (req, res) => {
  const { id } = req.params;
  const { type, title, date, note, completed } = req.body;
  console.log(`Updating memo ${id} with data:`, req.body);
  try {
    const pool = await poolPromise;
    await pool.request().query`
      UPDATE Memos
      SET type=${type}, title=${title}, date=${date}, note=${note}, completed=${completed}
      WHERE Id=${id}
    `;
    res.send({ message: "Memo updated" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Memos DELETE endpoint /memos/:id
app.delete("/memos/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting memo with id: ${id}`);
  try {
    const pool = await poolPromise;
    await pool.request().query`
      DELETE FROM Memos WHERE Id=${id}
    `;
    res.send({ message: "Memo deleted" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on port ${port}`));
