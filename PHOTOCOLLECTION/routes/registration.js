var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
//sign in/////
router.get("/signin", function (req, res, next) {
  res.render("registration", { msg: "" });
});

///submit registration////
router.post("/submit", function (req, res, next) {
  if (req.body.password !== req.body.confirmpassword) {
    res.render("registration", { msg: "password did not match" });
  } else {
    pool.query(
      "insert into registration(username,useremail,usermobilenumber,userpassword)values(?,?,?,?)",
      [
        req.body.name,
        req.body.email,
        req.body.contactnumber,
        req.body.password,
      ],
      function (err, result) {
        if (err) {
          res.render("registration", { msg: "pls try again" });
        } else {
          res.render("registration", { msg: "Registration succesful" });
        }
      }
    );
  }
});
///login///
router.get("/login", function (req, res, next) {
  res.render("login", { msg: "" });
});

//cheak login
router.post("/checklogin", function (req, res, next) {
  pool.query(
    "select * from registration where useremail=? and userpassword=?",
    [req.body.email, req.body.password],
    function (err, result) {
      if (err) {
        res.render("", { msg: "server error" });
      } else {
        if (result.length == 0) {
          res.render("login", { msg: "invalid user id and password" });
        } else {
          req.session.ses_admin = result;
          console.log(req.session.ses_admin);
          res.render("dashboard", { data: req.session.ses_admin });
        }
      }
    }
  );
});
///contactsubmit
router.post("/contactsubmit", upload.any(), function (req, res, next) {
  var userid = req.session.ses_admin[0].userid;
  pool.query(
    "insert into addfrd(name,email,contactnumber,relationship,description,file1,file2,userid)values(?,?,?,?,?,?,?,?)",
    [
      req.body.frdname,
      req.body.frdemail,
      req.body.frdcontactnumber,
      req.body.frdrelationship,
      req.body.frddescription,
      req.files[0].filename,
      req.files[1].filename,
      userid,
    ],
    function (err, result) {
      if (err) {
        res.render("dashboard", { msg: "Not Submit" });
      } else {
        res.render("dashboard", { msg: "Submit" });
      }
    }
  );
});
///displayall
router.get("/displayall", function (req, res) {
  if (!req.session.ses_admin) {
    res.render("login", { msg: "" });
  } else {
    var userid = req.session.ses_admin[0].userid;
    pool.query(
      "select * from addfrd   where userid=?",
      [userid],
      function (err, result) {
        if (err) {
          res.render("display", { data: [] });
        } else {
          console.log(result);
          res.render("display", { data: result });
        }
      }
    );
  }
});
/////delete
router.get("/delete", function (req, res) {
  pool.query(
    "delete from addfrd where frdid=?",
    [req.query.did],
    function (err, result) {
      if (err) {
        console.log(err);
        res.render("display", { data: [] });
      } else {
        res.render("dashboard");
      }
    }
  );
});
router.get("/display", function (req, res, next) {
  if (!req.session.ses_admin) {
    res.render("login", { msg: "" });
  } else {
    res.render("display");
  }
});

module.exports = router;
