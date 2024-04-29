var express = require("express")
const multer = require('multer');
;
var router = express.Router();
var auth= require('../middleware/auth');
var data = require("../controller/usercontroller");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/* GET home page. */

router.post("/",upload.single('image'), data.insert);
router.post("/update/:id", data.update_data);
router.get("/delete/:id", data.delete_data);
router.get("/",auth.auth_c, data.get_data);
router.post('/login', data.login_user);
router.get("/logout", data.logout);

module.exports = router;
