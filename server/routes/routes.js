const express = require("express");
const router = express.Router();
const con_db = require("../../db.js");
const encrypt_1 = require("../../encrypt.js");
const { render } = require("ejs");

//routes

router.get("", (req, res) => {
  res.render("form");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.post("/admin", async (req, res) => {
  const check = await encrypt_1.isPassTrue(req);
  if (check) {
    con_db.fetch(req, res);
  } else {
    res.redirect("/admin");
  }
  console.log(check);
});

router.get("/createtable", (req, res) => {
  con_db.ct(req, res);
});

router.get("/news", (req, res) => {
  res.render("news");
});

router.get("/edit_user/:id", (req, res) => {
  let id = req.params.id;
  con_db.show(id, res);
});

router.post("/edit/:id", (req, res) => {
  let id = req.params.id;
  con_db.update(id, req.body.ur, req.body.email);
  res.redirect("/admin");
});

router.get("/del_user/:id", (req, res) => {
  let id = req.params.id;
  con_db.del(id, res);
});

router.get("/add_user", (req, res) => {
  res.render("add_user");
});

router.get("/feedback", (req, res) => {
  res.render("feedback");
});

router.post("/feedback", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let feed = req.body.feed;
  con_db.insert_feed(username, email, feed);
  res.render("feedback");
});

router.get("/viewfeedback", (req, res) => {
  con_db.fetch_feedback(req, res);
  // res.render("view_feedback");
});

// router.get('/loggin',  (req,res)=>
// {
//     res.render("loged_in", );
// });

router.post("/adduser", (req, res) => {
  con_db.insert(req.body.ur, req.body.email, req.body.interest);
  res.redirect("/admin");
});
module.exports = router;
