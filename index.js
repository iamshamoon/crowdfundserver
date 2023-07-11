require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const session = require("express-session");
const path = require("path");

const withdrawRoute = require("./routes/withdrawRoute/withdraw.route");

const onboardUserRoute = require("./routes/onboardUserRoute/onboardUser.route");

const saveCardRoute = require("./routes/saveCardRoute/saveCard.route");

const createChargeRoute = require("./routes/createChargeRoute/createCharge.route");

const createCustomerRoute = require("./routes/createCustomerRoute/createCustomer.route");

const getCustomerRoute = require("./routes/getCustomerRoute/getCustomer.route");

const getCustomerCardsRoute = require("./routes/getCustomerCardsRoute/getCustomerCards.route");

const createdAccountRoute = require("./routes/createdAccountRoute/createdAccount.route");

const accountRoute = require("./routes/updateAccountRoute/account.route");

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());

app.use("/uploads", express.static("uploads"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crowdfunding",
});

const PORT = 8000;

const crypto = require("crypto");
const { log } = require("console");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.title + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
    last_signin_time VARCHAR(255)
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
  post_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  donated_amount INT NOT NULL,
  is_completed INT NOT NULL
)`;

  connection.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Challenges table created successfully");
  });
  const createUserChallengesTable = `
  CREATE TABLE IF NOT EXISTS user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
  )
`;

  connection.query(createUserChallengesTable, (err, result) => {
    if (err) throw err;
    console.log("User challenges table created successfully");
  });
  const createTempChallengesTable = `
  CREATE TABLE IF NOT EXISTS temp_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    post_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    donated_amount INT NOT NULL,
    user_id INT,
    is_completed INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`;

  connection.query(createTempChallengesTable, (err, result) => {
    if (err) throw err;
    console.log("Temp challenges table created successfully");
  });

  const createCardTableSql = `
      CREATE TABLE IF NOT EXISTS cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        account_title VARCHAR(255) NOT NULL,
        card_number VARCHAR(16) NOT NULL,
        cvc VARCHAR(4) NOT NULL,
        card_expiry DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

  connection.query(createCardTableSql, (err, result) => {
    if (err) throw err;
    console.log("Cards table created successfully");
  });

  const createUserDonationSql = `
      CREATE TABLE IF NOT EXISTS user_donations (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (challenge_id) REFERENCES challenges(id)
      );
    `;

  connection.query(createUserDonationSql, (err, result) => {
    if (err) throw err;
    console.log("User's Donations table created successfully");
  });
});

// const insertAdmin = `INSERT INTO admin (email, password, last_signin_time)
//     VALUES ('admin@crowdfund.com', 'admin12345', '${new Date()}')`;

// connection.query(insertAdmin, (err) => {
//   if (err) throw err;
//   console.log("Admin data inserted");
// });

router.use("/onboard-user", onboardUserRoute);
router.use("/save-card", saveCardRoute);
router.use("/create-charge", createChargeRoute);
router.use("/create-customer", createCustomerRoute);
router.use("/get-customer", getCustomerRoute);
router.use("/get-customer-cards", getCustomerCardsRoute);
router.use("/withdraw", withdrawRoute);
router.use("/accountCreated", createdAccountRoute);
router.use("/card", accountRoute);
// Add this line with other routes
router.use("/account-success", (req, res) => {
  const file = path.join(__dirname, "public", "success.html");
  res.sendFile(file);
});

//server
app.use("/api", router);

app.get("/get-challenges", (req, res) => {
  const query = `
    SELECT *
    FROM challenges
    WHERE id NOT IN (
      SELECT challenge_id
      FROM user_challenges
    )
  `;

  connection.query(query, (err, challenges) => {
    if (err) {
      return res.status(500).send(err);
    }
    const challengesList = challenges.map((challenge) => {
      let image_url = "http://localhost:8000/uploads/" + challenge.image;
      return {
        id: challenge.id,
        title: challenge.title,
        amount: challenge.amount,
        description: challenge.description,
        category: challenge.category,
        region: challenge.region,
        image_url: image_url,
        time_posted: challenge.post_time,
        donated_amount: challenge.donated_amount,
        is_completed: challenge.is_completed,
      };
    });
    return res.send(challengesList);
  });
});

app.post("/post-challenge", upload.single("image"), (req, res) => {
  const title = req.body.title;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const region = req.body.region;
  const userType = req.body.userType;
  const userId = req.body.userId;
  const image = title + "-" + req.file.originalname;
  console.log(req.body);

  const table = userType === "RECIEVER" ? "temp_challenges" : "challenges";
  const query =
    `INSERT INTO ${table} (title, amount, description, category, region, image` +
    (userType === "RECIEVER" ? ", user_id" : "") +
    `) VALUES (?, ?, ?, ?, ?, ? ` +
    (userType === "RECIEVER" ? ", ?" : "") +
    `)`;

  const values =
    userType === "RECIEVER"
      ? [title, amount, description, category, region, image, userId]
      : [title, amount, description, category, region, image];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to save challenge." });
    } else {
      res.status(200).json({ message: "Challenge saved successfully." });
    }
  });
});

//====================== | Challange and dontaion | =========================
app.get("/get-challenge/:cid", (req, res) => {
  const challenge_id = req.params.cid;
  const query = "SELECT * FROM challenges where id = ?";
  connection.query(query, [challenge_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error! (500)" });
    }
    if (result.length !== 0) {
      return res.status(200).json(
        result.map((challenge) => {
          let image_url = "http://localhost:8000/uploads/" + challenge.image;
          return {
            id: challenge.id,
            title: challenge.title,
            amount: challenge.amount,
            description: challenge.description,
            category: challenge.category,
            region: challenge.region,
            image_url: image_url,
            time_posted: challenge.post_time,
            donated_amount: challenge.donated_amount,
            rating: challenge.rating,
            authenticated_by: challenge.authenticated_by,
            is_completed: challenge.is_completed,
          };
        })[0]
      );
    } else {
      return res.status(400).json({ error: "No such challenge found!" });
    }
  });
});

app.post("/set-challenge", (req, res) => {
  const { userId, challengeId } = req.body;

  const query =
    "INSERT INTO user_challenges (user_id, challenge_id) VALUES (?, ?)";
  connection.query(query, [userId, challengeId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Challenge set for user successfully." });
  });
});

app.get("/active-challenges/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT c.* 
    FROM challenges c
    INNER JOIN user_challenges uc ON c.id = uc.challenge_id
    WHERE uc.user_id = ?
  `;

  connection.query(query, [userId], (err, challenges) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(
      challenges.map((challenge) => {
        let image_url = "http://localhost:8000/uploads/" + challenge.image;
        return {
          id: challenge.id,
          title: challenge.title,
          amount: challenge.amount,
          description: challenge.description,
          category: challenge.category,
          region: challenge.region,
          image_url: image_url,
          time_posted: challenge.post_time,
          donated_amount: challenge.donated_amount,
          rating: challenge.rating,
          authenticated_by: challenge.authenticated_by,
          is_completed: challenge.is_completed,
        };
      })
    );
  });
});

app.get("/posted-challenges/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT challenges.*, user_donations.message AS message
    FROM challenges
    LEFT JOIN user_donations ON challenges.id = user_donations.challenge_id
    WHERE challenges.user_id = ?
  `;

  connection.query(query, [userId], (err, postedChallenges) => {
    if (err) return res.status(500).send(err);

    // Create an object to store the challenges with their messages
    const challengesWithMessages = {};

    // Iterate through the postedChallenges and group messages by challenge_id
    postedChallenges.forEach((challenge) => {
      const challengeId = challenge.id;

      if (!challengesWithMessages[challengeId]) {
        challengesWithMessages[challengeId] = {
          ...challenge,
          messages: [], // Initialize an empty array for messages
        };
      }

      if (challenge.message) {
        challengesWithMessages[challengeId].messages.push(challenge.message);
      }
    });

    // Convert the object values to an array
    const result = Object.values(challengesWithMessages);

    res.status(200).json(result);
  });
});

// app.get("/posted-challenges/:userId", (req, res) => {
//   const userId = req.params.userId;
//   //  SELECT c.id, c.category AS category, c.title AS donation_title, c.amount AS total_amount, c.image AS image_url, c.description AS challenge_description, c.donated_amount AS donated_amount
//   // SELECT * FROM challenges WHERE user_id = ?
//   const query = `
//   SELECT challenges.*, user_donations.message AS message
// FROM challenges
// LEFT JOIN user_donations ON challenges.id = user_donations.challenge_id
// WHERE challenges.user_id = ?

// `;

//   connection.query(query, [userId], (err, postedChallenges) => {
//     if (err) return res.status(500).send(err);
//     // console.log(postedChallenges);
//     res.status(200).json(postedChallenges);
//   });
// });

app.post("/cancel-challenge", (req, res) => {
  const { userId, challengeId } = req.body;

  const query =
    "DELETE FROM user_challenges WHERE user_id = ? AND challenge_id = ?";

  connection.query(query, [userId, challengeId], (err, result) => {
    if (err) return res.status(500).send(err);
    res
      .status(200)
      .json({ message: "Challenge canceled for user successfully." });
  });
});

app.post("/donate", (req, res) => {
  const { userId, challengeId, amount, message } = req.body;
  // Check if the user has an active challenge with the provided challengeId
  connection.query(
    "SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?",
    [userId, challengeId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res
          .status(400)
          .json({ message: "The user does not have this challenge active" });
      }

      //Updating amounts in user_donations table

      connection.query(
        "SELECT * FROM user_donations WHERE user_id = ? AND challenge_id = ?",
        [userId, challengeId],
        (err, result) => {
          if (err) return res.status(500).send(err);

          if (result.length === 0) {
            //if record doesn't exist already, insert it
            connection.query(
              "INSERT INTO user_donations (user_id, challenge_id, donated_amount, message) VALUES (?, ?, ?, ?)",
              [userId, challengeId, amount, message],
              (err, result) => {
                if (err) return res.status(500).send(err);
              }
            );
          } else {
            //if record already exists, update it
            connection.query(
              "UPDATE user_donations SET donated_amount = donated_amount + ? WHERE user_id = ? AND challenge_id = ?",
              [amount, userId, challengeId],
              (err, result) => {
                if (err) return res.status(500).send(err);
              }
            );
          }
        }
      );

      // Update receiver's balance
      connection.query(
        "UPDATE users SET balance = balance + ? WHERE id = ( SELECT user_id FROM challenges WHERE id = ?);",
        [amount, challengeId],
        (err, result) => {
          if (err) return res.status(500).send(err);
        }
      );

      // Update the donated_amount for the challenge
      connection.query(
        "UPDATE challenges SET donated_amount = donated_amount + ? WHERE id = ?",
        [amount, challengeId],
        (err, result) => {
          if (err) return res.status(500).send(err);

          // Check if the challenge is completed
          connection.query(
            "SELECT * FROM challenges WHERE id = ? AND donated_amount >= amount",
            [challengeId],
            (err, result) => {
              if (err) return res.status(500).send(err);

              if (result.length > 0) {
                connection.query(
                  "UPDATE challenges SET is_completed = 1  WHERE id = ?",
                  [challengeId],
                  (err, result) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).json({
                      didChallangeComplete: true,
                      message: "Donation successful, challenge completed",
                    });
                  }
                );
              } else {
                res.status(200).json({
                  message: "Donation successful.",
                  didChallangeComplete: false,
                });
              }
            }
          );
        }
      );
    }
  );
});

app.post("/withdraw-balance", (req, res) => {
  const { userId, amount } = req.body;

  var query = `UPDATE users SET balance = balance - ? WHERE id = ?`;
  connection.query(query, [amount, userId], (err, result) => {
    if (err) return res.status(500).send(err);
  });
});

//====================== | User dontaion history | =========================
app.get("/user-donations/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
  SELECT ud.id, ud.challenge_id, ud.donated_amount, ud.individual_rating, ud.date_of_donation, u.name AS user_name, c.title AS donation_title, c.amount AS total_amount, c.image AS image_url, c.description AS challenge_description
  FROM user_donations ud
  JOIN users u ON u.id = ud.user_id
  JOIN challenges c ON c.id = ud.challenge_id
  WHERE u.id = ?
`;

  connection.query(query, [userId], (err, donations) => {
    if (err) return res.status(500).send(err);
    console.log(donations);
    res.status(200).json(donations);
  });
});

app.post("/rating", (req, res) => {
  const { userId, challengeId, individual_rating } = req.body;

  var query = `UPDATE user_donations SET individual_rating = ? WHERE user_id = ? AND challenge_id = ?`;
  connection.query(
    query,
    [individual_rating, userId, challengeId],
    (err, result) => {
      if (err) return res.status(500).send(err);
    }
  );

  query = `UPDATE challenges SET rating = rating + ?, authenticated_by = authenticated_by + ? WHERE challenges.id = ?`;
  connection.query(
    query,
    [individual_rating, 1, challengeId],
    (err, result) => {
      if (err) return res.status(500).send(err);
    }
  );
});

// app.get("/individual-rating/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const query = `
//   SELECT ud.id, ud.donated_amount, ud.date_of_donation, u.name AS user_name, c.title AS donation_title, c.amount AS total_amount, c.image AS image_url, c.description AS challenge_description
//   FROM user_donations ud
//   JOIN users u ON u.id = ud.user_id
//   JOIN challenges c ON c.id = ud.challenge_id
//   WHERE u.id = ?
// `;

//   connection.query(query, [userId], (err, donations) => {
//     if (err) return res.status(500).send(err);
//     console.log(donations);
//     res.status(200).json(donations);
//   });
// });

//======================= | User Interactions | ===============================

//register with hash

app.post("/register", (req, res) => {
  const { name, email, phoneNo, CNIC, ntn, password, roll } = req.body;
  console.log(roll);

  // Hash the password using SHA256
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const sql =
    "INSERT INTO users (name, email, phoneNo, password, CNIC, ntn, roll, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [name, email, phoneNo, hashedPassword, CNIC, ntn, roll, 1],
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

//register without hash

// app.post("/register", (req, res) => {
//   const { name, email, phoneNo, CNIC, ntn, password, roll } = req.body;
//   console.log(roll);
//   const sql =
//     "INSERT INTO users (name, email, phoneNo, password, CNIC, ntn, roll, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//   connection.query(
//     sql,
//     [name, email, phoneNo, password, CNIC, ntn, roll, 1],
//     (err, result) => {
//       if (err) {
//         if (err.code === "ER_DUP_ENTRY") {
//           res.status(401).json({ err: "Email already in use!" });
//         } else {
//           res.status(500).json({ message: "Error registering user", err: err });
//         }
//       } else {
//         res.status(200).json({ message: "User registered successfully" });
//       }
//     }
//   );
// });

app.post("/become-customer", (req, res) => {
  const { userId, customerId } = req.body;

  const sql = "UPDATE users SET customer_id = ? WHERE id = ?";
  connection.query(sql, [customerId, userId], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error adding customer", err: err });
      throw err;
    }
    connection.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId],
      (err, user) => {
        if (err) {
          res.status(500).json({ message: "Error adding customer", err: err });
          throw err;
        } else {
          res
            .status(200)
            .json({ message: "Customer added successfully", user: user[0] });
        }
      }
    );
  });
});

//login with hash

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error logging in" });
    } else if (result.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      const user = result[0];
      const hashedPasswordFromDB = user.password;

      // Unhash the password provided by the user
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (hashedPasswordFromDB === hashedPassword) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        res
          .status(200)
          .json({ message: "Logged in successfully", token, user });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    }
  });
});

//login without hash

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
//   connection.query(sql, [email, password], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: "Error logging in" });
//     } else if (result.length === 0) {
//       res.status(401).json({ message: "Invalid email or password" });
//     } else {
//       const user = result[0];
//       const token = jwt.sign({ id: user.id }, process.env.SECRET);
//       res.status(200).json({ message: "Logged in successfully", token, user });
//     }
//   });
// });

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

//===================== | Admin Interactions | ===========================
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error logging in" });
    } else if (result.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      const user = result[0];
      const token = jwt.sign({ id: user.email }, process.env.SECRET);
      res.status(200).json({ message: "Logged in successfully", token, user });
    }
  });
});

app.post("/admin-logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.SECRET);
    // Invalidate or delete the token from the storage
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.get("/get-temp-challenges", (req, res) => {
  const query = `
    SELECT temp_challenges.*, users.name, users.email, users.phoneNo, users.CNIC, users.roll, users.active,users.ntn
    FROM temp_challenges
    LEFT JOIN users ON temp_challenges.user_id = users.id
  `;

  connection.query(query, (err, tempChallenges) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(tempChallenges);
  });
});

app.post("/accept-temp-challenge/:id", (req, res) => {
  const id = req.params.id;

  // Copy the temporary challenge to the challenges table
  connection.query(
    `SELECT * FROM temp_challenges WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) {
        return;
      }
      const temp_challenge = result[0];
      const tmp = [
        temp_challenge.id,
        temp_challenge.user_id,
        temp_challenge.category,
        temp_challenge.region,
        temp_challenge.title,
        temp_challenge.amount,
        temp_challenge.description,
        temp_challenge.image,
        temp_challenge.post_time,
        0,
        0,
      ];
      const sql =
        "INSERT INTO challenges (id,user_id,category,region,title,amount,description,image,post_time,donated_amount,is_completed) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sql, tmp, (err, _2) => {
        if (err) return res.status(500).send(err);

        // Delete the temporary challenge from the temp_challenges table
        connection.query(
          "DELETE FROM temp_challenges WHERE id = ?",
          [id],
          (err3, _3) => {
            if (err3) return res.status(500).send(err3);
            res.status(200).json({
              message: "Temporary challenge accepted and moved to challenges.",
            });
          }
        );
      });
    }
  );
});

app.post("/reject-temp-challenge/:id", (req, res) => {
  const id = req.params.id;

  // Delete the temporary challenge from the temp_challenges table
  connection.query(
    "DELETE FROM temp_challenges WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res
        .status(200)
        .json({ message: "Temporary challenge rejected and deleted." });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
