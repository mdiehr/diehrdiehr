var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'diehrdiehrstudios@gmail.com',
    pass: 'pangurban'
  }
});

/* POST email. */
router.post('/', function(req, res, next) {

  // Configure email.
  var mailOptions = {
    from: req.body.name + '<' + req.body.email + '>',
    to: 'btdiehr@gmail.com',
    subject: 'Diehr & Diehr Contact Form',
    text:'Email: ' + req.body.email + '\n' +
         'Name: ' + req.body.name + '\n' +
         'Phone: ' + req.body.phone + '\n' +
         'Message: ' + req.body.message
  };

  // Send email.
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      res.sendStatus(error.responseCode);
    } else{
      res.sendStatus(200);
    }
  });
});

module.exports = router;
