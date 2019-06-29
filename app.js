const express = require("express");
const exphbs = require("express-handlebars");
const Twocheckout = require("2checkout-node");
const request = require("request");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main.hbs",
    partialsDir: path.join(__dirname, "views"),
    layoutsDir: path.join(__dirname, "views/Layouts")
  })
);
app.set("view engine", "hbs");

app.use(express.json(), express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/pay", (request, response) => {
    let tco = new Twocheckout({
      sellerId: "901410990",
      privateKey: "306CCEE4-CD64-4FF3-B43B-7ADB5D8AEDE3",
      sandbox: true
    });
    let params = {
      merchantOrderId: "123",
      token: request.body.token,
      currency: "USD",
      total: "10.00",
      billingAddr: {
        name: "Anies Rayyes",
        addrLine1: "000 Test St",
        city: "gaza",
        state: "palestine",
        zipCode: "25467",
        country: "palestine",
        email: "test@2co.com",
        phoneNumber: "1111111111"
      }
    };
    tco.checkout.authorize(params, function(error, data) {
      console.log(data);
      if (error) {
        response.send(error.message);
      } else {
        console.log(data);
        response.send(data.response.responseMsg);
      }
    });
  });

app.listen(app.get("port"), () => {
  console.log(`server is running on port ${app.get("port")}`);
});
