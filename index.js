const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  port: 7860,
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  insecureAuth: true,
});

// after transfered table

app.get("/transfer", (req, res) => {
  db.query("SELECT * FROM transaction  ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/transfer", (req, res) => {
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const transfer = req.body.transfer;

  db.query(
    "INSERT INTO transaction(sender, receiver, transfer) VALUES(?,?,?)",
    [sender, receiver, transfer],
    (err, result) => {
      if (!err) {
        res.send("Value Added succesfully");
      } else {
        console.log(err);
      }
    }
  );
});

app.put("/:id", (req, res) => {
  const balance = req.body.balance;

  db.query(
    "UPDATE customer SET balance = ? WHERE id = ?",
    [balance, req.params.id],
    (err, res) => {
      if (!err) {
        console.log("Success");
      } else {
        console.log("failed");
      }
    }
  );
});

app.get("/request", (req, res) => {
  db.query("SELECT * FROM customer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/:email", (req, res) => {
  db.query(
    "SELECT id, balance FROM customer WHERE email = ?",
    [req.params.email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Listen on port ${port}`));
