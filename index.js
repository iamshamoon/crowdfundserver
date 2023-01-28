require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crowdfunding",
});

const PORT = 8000;

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
    connection.query(
      `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, phoneNo VARCHAR(255) NOT NULL,roll VARCHAR(255) NOT NULL, active INT NOT NULL)`,
      (err) => {
        if (err) throw err;
      }
    );
  }
});

app.post("/register", (req, res) => {
  const { name, email, phoneNo, password, roll } = req.body;
  console.log(roll);
  const sql =
    "INSERT INTO users (name, email, phoneNo, password, roll, active) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [name, email, phoneNo, password, roll, 1],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(401).json({ err: "Email already in use!" });
        } else {
          res.status(500).json({ message: "Error registering user", err: err });
        }
      } else {
        res.status(200).json({ message: "User registered successfully" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error logging in" });
    } else if (result.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      const user = result[0];
      const token = jwt.sign({ id: user.id }, process.env.SECRET);
      res.status(200).json({ message: "Logged in successfully", token, user });
    }
  });
});

app.post("/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.SECRET);
    // Invalidate or delete the token from the storage
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});
app.patch("/update-user/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, email } = req.body;
  const query = `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id}`;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const selectQuery = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(selectQuery, (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log(user[0]);
      res.status(201).json({ message: "User updated", user: user[0] });
    });
  });
});

app.put("/activate/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE users SET active = 1 WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    const selectQuery = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(selectQuery, (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log(user[0]);
      res.status(201).json({ message: "User activated", user: user[0] });
    });
  });
});

// Deactivate user account
app.put("/deactivate/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE users SET active = 0 WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    const selectQuery = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(selectQuery, (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log(user[0]);
      res.status(201).json({ message: "User deactivated", user: user[0] });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
