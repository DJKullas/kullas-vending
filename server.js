var sslRedirect = require('heroku-ssl-redirect');
var express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
 
var app = express();

// enable ssl redirect
app.use(sslRedirect());

app.use(bodyParser.urlencoded({extended: true}));
 
app.use(express.static('public'));

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

// POST route from contact form
app.post('/contact', (req, res) => {

    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    });

    // Specify what the email will look like
    const mailOpts = {
      from: 'Your sender info here', // This is ignored by Gmail
      to: BUSINESS_EMAIL,
      subject: 'Kullas Vending Solutions Contact From',
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    }
  
    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
          console.log("ERROR: " + error);
      }
      else {
          console.log(response);
      }
    })
  });


var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});