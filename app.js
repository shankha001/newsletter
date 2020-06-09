//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const https = require("https");
const app = express();
var status;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.mail;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };


  const jsonData = JSON.stringify(data);

  const url = process.env.URL;

  const options = {
    method: "post",
    auth: "process.env.API_KEY"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      status = response.statusCode;
      if (status === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);

  request.end();


});


app.post("/failure", function(req, res){
  res.redirect("/");
});





app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
