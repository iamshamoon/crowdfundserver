require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const session = require("express-session");

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crowdfunding",
});

const PORT = 8000;

const upload = multer({ dest: "uploads/" });

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
    connection.query(
      `
  CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_signin_time TIMESTAMP
  )
`,
      function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      }
    );
  }
  const createTable = `CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  post_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

  connection.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Challenges table created successfully");
  });
});

app.post("/admin/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    connection.query(
      "SELECT * FROM admin WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.email = email;
          res.send({ status: 200, message: "Logged in successfully" });
        } else {
          res.send({ status: 401, message: "Invalid Credentials" });
        }
        res.end();
      }
    );
  } else {
    res.send({ status: 401, message: "Please enter Email and Password" });
    res.end();
  }
});

app.get("/admin/logout", function (req, res) {
  req.session.destroy();
  res.send({ status: 200, message: "Logged out successfully" });
});

app.get("/get-challenges", (req, res) => {
  connection.query("SELECT * FROM challenges", (err, challenges) => {
    if (err) {
      return res.status(500).send(err);
    }
    const challengesList = challenges.map((challenge) => {
      let image_url = "http://localhost:3000/uploads/" + challenge.image_url;
      return {
        id: challenge.id,
        title: challenge.title,
        amount: challenge.amount,
        description: challenge.description,
        image_url: image_url,
      };
    });
    return res.send(challengesList);
  });
});

app.post("/post-challenge", upload.single("image"), (req, res) => {
  // Get the form data
  const title = req.body.title;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const region = req.body.region;

  // Get the image file
  const image = req.file;

  // Generate a unique file name for the image
  const imageFileName = `${Date.now()}-${image.originalname}`;

  // Insert the challenge information into the database
  const query =
    "INSERT INTO challenges (title, amount, description, category, region, image) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [title, amount, description, category, region, imageFileName];
  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to save challenge." });
    } else {
      res.status(200).json({ message: "Challenge saved successfully." });
    }
  });
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
