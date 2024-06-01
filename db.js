const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
//create connection to database

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.MYSQL_SSL,
  },
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

//Inserting data into table

const insert_sql = `INSERT INTO aen (user, email, intereste) VALUES (?, ?, ?);`;

const insert_feedback_sql = `INSERT INTO feedback (username, email, feedback) VALUES (?, ?, ?);`;

const insert = (ur, email, interest) => {
  db.query(insert_sql, [ur, email, interest], (err, result) => {
    if (err) throw err;
    console.log(`Number of records inserted: ${result.affectedRows}`);
  });
};

//inserting Feedback
const insert_feed = (ur, email, feed) => {
  db.query(insert_feedback_sql, [ur, email, feed], (err, result) => {
    if (err) throw err;
    console.log(`Number of records inserted: ${result.affectedRows}`);
  });
};

//Updating user data into table aen

const update = (id, ur, email) => {
  const update_sql = `UPDATE aen set user = ?, email = ? WHERE id = "${id}"`;

  db.query(update_sql, [ur, email], (err, result) => {
    if (err) throw err;
    console.log(`Number of records inserted: ${result.affectedRows}`);
  });
};

// creating a table
const ct = (req, res) => {
  let sql =
    "CREATE TABLE aen (id INT AUTO_INCREMENT PRIMARY KEY,user VARCHAR(255),email VARCHAR(255), intereste VARCHAR(255));";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Table created succefully");
  });
};

//fetching all user
const fetch = (req, res) => {
  let sql = "SELECT * FROM aen";

  db.query(sql, (err, rows) => {
    console.log(rows);
    if (!err) {
      res.render("table", { rows });
    } else {
      console.log("Error occured" + err);
    }
  });
};

//fetching feedback
const fetch_feedback = (req, res) => {
  let sql = "SELECT * FROM feedback";

  db.query(sql, (err, rows) => {
    console.log(rows);
    if (!err) {
      res.render("view_feedback", { rows });
    } else {
      console.log("Error occured" + err);
    }
  });
};
//fetching single user
const show = (id, res) => {
  let show_sql = "SELECT * FROM aen WHERE id=?";

  db.query(show_sql, [id], (err, rows) => {
    if (!err) {
      res.render("edit_user", { rows });
    } else {
      console.log("Error occured" + err);
    }
  });
};

//Deleting a user
const del = (id, res) => {
  let sql = "DELETE FROM aen WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (!err) {
      res.redirect("/admin");
    } else {
      console.log("Error occured" + err);
    }
  });
};

//exproting functions
module.exports = {
  insert,
  ct,
  fetch,
  insert_feed,
  fetch_feedback,
  db,
  update,
  show,
  del,
};
