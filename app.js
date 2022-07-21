const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const url = "https://us9.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME :  lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const options = {
        method :'POST',
        auth : "chabi:"+process.env.API_KEY
    }
    const request = https.request(url,options,(response)=>{
        if(response.statusCode === 200 ){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/faliure.html");
        }

        response.on("data",(data)=>{
            // console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/faliure.html",(req,res)=>{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Port 3000 is running.");
})
