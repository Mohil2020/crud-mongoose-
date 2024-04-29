var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

var usermodel = require("../model/usermodel");
const storage = require("node-persist");
storage.init(/* options ... */);
const bcrypt = require("bcrypt");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mohilmoliya2020@gmail.com",
    pass: "irqa bkgy clha zaku",
  },
});

exports.insert = async (req, res) => {
  var b_pass = await bcrypt.hash(req.body.password, 10);
  req.body.password = b_pass;
  req.body.image = req.file.originalname;
  var mailOptions = {
    from: "mohilmoliya20@gmail.com",
    to: req.body.email,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  var data = await usermodel.create(req.body);

  res.status(200).json({
    status: "data insert",
    data,
  });
};

exports.get_data = async (req, res) => {
  // var data =await usermodel.find().count();
  // var data =await usermodel.find().skip(2);
  // var data =await usermodel.find().limit(1);
  // var limit=2;
  var data_no = await usermodel.find().count();
  var page_no = req.query.page_no;
  if (page_no == undefined) {
    //req.query= ? , req.params= /

    page_no = 1;
  }
  var limit_no = 2;
  var start = (page_no - 1) * limit_no; //skip  //2 * 2 =4    // 1 * 2 =2

  var data = await usermodel.find().skip(start).limit(limit_no);
  var total_data = await usermodel.find().count();
  var total_page = Math.ceil(total_data / limit_no);

  res.status(200).json({
    data,
    page_no,
    total_data,
    total_page,
  });
};

exports.update_data = async (req, res) => {
  let id = req.params.id;
  var data = await usermodel.findByIdAndUpdate(id, req.body);
  res.status(200).json({
    status: "data update",
    data,
  });
};

exports.delete_data = async (req, res) => {
  let id = req.params.id;
  var data = await usermodel.findByIdAndDelete(id);
  res.status(200).json({
    status: "data delete",
  });
};

exports.login_user = async (req, res) => {
  var login_status = await storage.getItem("login");
  // debugger
  if (login_status == undefined) {
    let data = await usermodel.find({ email: req.body.email });
    console.log(data);
    if (data.length == 1) {
      bcrypt.compare(
        req.body.password,
        data[0].password,
        async (error, result) => {
          if (result) {
            var token = jwt.sign({ id: data[0].id }, "token");
            await storage.setItem("login", data[0].id);
            res.status(200).json({
              status: 200,
              message: "login sucessfully",
              token,
            });
          } else {
            res.status(200).json({
              status: 200,
              message: "check your email and password",
            });
          }
        }
      );
    } else {
      res.status(200).json({
        status: 200,
        status: "not  check and your email and password ",
      });
    }
  } else {
    res.status(200).json({
      status: 200,
      message: "already login",
    });
  }
};

exports.logout = async (req, res) => {
  await storage.clear();
  res.status(200).json({
    status: "logout",
  });
};
