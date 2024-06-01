//REQUIREMENTS
let port = 3000;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const con_db = require("./db.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const routes = require("./server/routes/routes.js");
dotenv.config();

// mail config
let mail_config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
};

// send mail with defined transport object
const transporter = nodemailer.createTransport(mail_config);

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/", routes);

//template engine
const handlebars = exphbs.create({ extname: "hbs" });
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

//
const log_in = (data, res) => {
  res.render("log", { data });
};

//sending email
app.post("/sendmail", (req, res) => {
  console.log(req.body.email);

  let ur = req.body.ur;
  let email = req.body.email;
  let interest = req.body.interest;

  const data = [
    {
      ur: req.body.ur,
      email: req.body.email,
      interest: req.body.interest,
    },
  ];

  con_db.insert(ur, email, interest);

  transporter.sendMail({
    from: '"Fred Foo 👻" teamk.project.aen@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Thank you", // plain text body
    html: `<div
    style="background-color: #f6f6f6; margin: 0px; padding: 20px"
    bgcolor="f9f9f9"
  >
    <table
      cellspacing="0"
      border="0"
      cellpadding="0"
      align="center"
      width="650"
      bgcolor="white"
      class="m_2037621378245083739main"
      style="
        border-collapse: separate;
        border-spacing: 0;
        font-family: Helvetica, Arial, sans-serif;
        letter-spacing: 0;
        table-layout: fixed;
      "
    >
      <tbody>
        <tr>
          <td class="m_2037621378245083739main-td">
            <table
              width="100%"
              class="m_2037621378245083739header"
              style="
                border-collapse: separate;
                border-spacing: 0;
                table-layout: fixed;
                background: linear-gradient(
                  180deg,
                  rgba(255, 82, 0, 1) 0%,
                  rgba(255, 119, 0, 1) 100%
                );
              "
            >
              <tbody>
                <tr>
                  <td
                    class="m_2037621378245083739logo"
                    style="
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      padding: 0;
                      text-align: center;
                    "
                    align="center"
                  >
                    <img
                      src="https://mail.google.com/mail/u/0?ui=2&amp;ik=a3aa7e04df&amp;attid=0.1.4&amp;permmsgid=msg-f:1795400157374162384&amp;th=18ea8aee41f7a5d0&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ-mJqyohhCATgP9L9wQSSK7kYl86HJRqlqX6Mb6iJkAa_UBcFUMyqFdPhIuM2giVpvwaxZMh0kx6dt18hHitJXHep1xqpthrVoBYf1I2Yio-JjVQYEOwc2zxIY&amp;disp=emb"
                      style="padding: 20px; text-align: left"
                      data-image-whitelisted=""
                      class="CToWUd"
                      data-bit="iit"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
  
            <table
              width="100%"
              style="
                border-collapse: separate;
                border-spacing: 0;
                table-layout: fixed;
              "
            >
              <tbody>
                <tr>
                  <td
                    class="m_2037621378245083739content-td"
                    style="
                      color: #222222;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 14px;
                      line-height: 22px;
                      padding: 20px;
                    "
                  >
                    <h2>Hello, ${req.body.ur}!</h2>
                    <p>
                      <b>Thank you for subscribing to our Newsletter Service..</b>
                    </p>
                    <p>
                      This Free newslettter services are automatically send to you
                      via email according to the selected intereste
                    </p>
                    <p>
                      To reduce your carbon footprint, you can also power off or
                      delete services yourself at any time.
                    </p>
                    <p>
                      Regards,<br />
                      Team K
                    </p>
                    <hr />
                    <p>
                      <small>Please do not reply directly to this email.</small>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <table
              width="100%"
              style="
                border-collapse: separate;
                border-spacing: 0;
                table-layout: fixed;
              "
            >
              <tbody>
                <tr>
                  <td
                    class="m_2037621378245083739footer-td"
                    style="
                      color: #999999;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 12px;
                      text-align: center;
                      padding: 20px;
                    "
                  >
                    <p>
                      (Messages essential to service operations cannot be
                      unsubscribed from)
                    </p>
                    <p></p>
                    <a
                      href="https://aen-teamk.onrender.com/"
                      target="_blank"
                      data-saferedirecturl="https://www.google.com/url?q=https://aen-teamk.onrender.com/"
                      >Automated email Newsletter</a
                    >
                    | India
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="yj6qo"></div>
    <div class="adL"></div>
  </div>
  
        `, // html body
  });

  log_in(data, res);
});

//sending email from admin
app.post("/sendmailbyadmin", (req, res) => {
  let emails = `SELECT email FROM aen WHERE intereste = "${req.body.interest}"`;
  let subject = req.body.subject;
  let topic = req.body.topic;
  let contant = req.body.contant;

  let to_list = [];
  con_db.db.query(emails, (err, email) => {
    console.log(email);

    for (k in email) {
      to_list.push(email[k].email);
    }

    console.log(to_list);

    const options = {
      from: '"Fred Foo 👻" teamk.project.aen@gmail.com', // sender address
      to: to_list, // list of receivers
      subject: subject, // Subject line
      text: topic, // plain text body
      html: `<b>${contant}</b>`, // html body
    };

    transporter.sendMail(options);
  });
  res.redirect("/news");
});

//listen
app.listen(process.env.PORT || port, () => {
  console.log("server started");
});
