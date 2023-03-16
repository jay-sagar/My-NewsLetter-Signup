const express = require('express');
const https = require('https');
const app = express();
const PORT = 3000 || process.env.PORT; // it will run in locally if external sever is not present
const bodyParser = require("body-parser");
const API_KEY = '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'; // Replace with your Sendinblue API key
const LIST_ID = 6;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
  
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  const data = {
    email: email,
    listIds: [LIST_ID],
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    },
  };

  const jsonData = JSON.stringify(data);

  const url = "https://app.sendinblue.com/contact"

  const options = {
    method: 'POST',
    hostname: 'api.sendinblue.com',
    path: '/v3/contacts',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
  };

  const request = https.request(url, options, function(response){
    
    if (response.statusCode == 201) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res){
  res.redirect("/"); 
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

