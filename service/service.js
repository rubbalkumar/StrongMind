const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const parser= express.json();

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors())


function createConnection(){
    var connection = mysql.createConnection({
      host: 'database-1.coteao1jrhs8.us-west-1.rds.amazonaws.com',
      user: 'admin',
      port:'3306',       
      database: 'strong_mind',
      password: 'Abcd1234',
      timeout: 60000,
      multipleStatements: true
    });
    return connection;
  }

var myConnection = createConnection();

myConnection.connect(function(err) {
    console.log("Connected!");
  });
  

// Fetch all the toppings for owner
app.get('/toppings', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    myconnect = createConnection();
    myconnect.connect(function(err) {
    var sql = 'SELECT * FROM topping;';
    //console.log(sql);
    myconnect.query(sql, function (err, result, fields) {
        //console.log(result)
        var topping = [];
        toppings = {};
        for (var i in result) {
            topping.push(result[i])
        }
        toppings = {"Toppings" : topping}
        res.send(toppings);          
  });
});
});

//Add a new topping for owner
app.post('/topping', function(req, res)
{
  var toppingname = req.body.toppingname;
  var sql = "INSERT INTO topping (ToppingName) VALUE ('" + toppingname + "');"; 

  myconnect = createConnection();

  myconnect.connect(function(err) 
  {
    if (err) throw err;
    myconnect.query(sql, function (err, result, fields) 
    {
      if(err){
        res.status(500).json("Invalid Data");
      }else{
        res.send({"Result":"Success"});
      }              
    });
  });
});

// Update topping for owner
app.patch('/updatetopping', function(req, res)
{
  var newtoppingname = req.body.newtoppingname;
  var toppingID = req.body.toppingID;
  var sql = "UPDATE topping SET ToppingName = '" + newtoppingname + "' WHERE toppingid = '" + toppingID + "';"; 
  console.log(sql);
  myconnect = createConnection();

  myconnect.connect(function(err) 
  {
    if (err) throw err;
    myconnect.query(sql, function (err, result, fields) 
    {
      if(err){
        res.status(500).json("Invalid Data");
      }else{
        res.send({"Result":"Success"});
      }              
    });
  });
});

// Delete a topping for owner
app.delete('/deletetopping', function(req, res)
{
  var toppingID = req.body.toppingID;
  var sql = "DELETE FROM topping WHERE toppingid = '" + toppingID + "';"; 
  console.log(sql);

  myconnect = createConnection();

  myconnect.connect(function(err) 
  {
    if (err) throw err;
    myconnect.query(sql, function (err, result, fields) 
    {
      if(err){
        res.status(500).json("Invalid Data");
      }else{
        res.send({"Result":"Success"});
      }              
    });
  });
});


// Get All Pizzas for Chef
app.get('/pizzas', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    myconnect = createConnection();
    myconnect.connect(function(err) {
    var sql = 'SELECT pizza.PizzaName, topping.ToppingName, pizza.PizzaID, topping.ToppingID, pizzaingredient.PizzaIngredientID FROM pizza ' + 
    'JOIN pizzaingredient ON pizza.pizzaid = pizzaingredient.pizzaid ' +
    'JOIN topping on topping.toppingid = pizzaingredient.toppingid;';
    //console.log(sql);
    myconnect.query(sql, function (err, result, fields) {
        //console.log(result)
        var pizza = [];
        pizzas = {};
        for (var i in result) {
            pizza.push(result[i])
        }
        pizzas = {"Pizzas" : pizza}
        res.send(pizzas);          
  });
});
});


//Add a new pizza for chef
app.post('/pizza', function(req, res)
{
  var pizzaname = req.body.pizzaname;
  var toppingID = req.body.toppingid;

  var toppingSQL = '';
  for (let i = 0; i < toppingID.length; i++) {
    toppingSQL += "INSERT INTO pizzaingredient (PizzaID, ToppingID) VALUE (@pizzaid, '" + toppingID[i] + "');";
    //console.log(toppingID[i], toppingID);
  }

  var sql = "INSERT INTO pizza (PizzaName) VALUE ('" + pizzaname + "'); SELECT LAST_INSERT_ID() into @pizzaid;" + toppingSQL;
  console.log(sql);

  myconnect = createConnection();

  myconnect.connect(function(err) 
  {
    if (err) throw err;
    myconnect.query(sql, function (err, result, fields) 
    {
      if(err){
        res.status(500).json("Invalid Data");
      }else{
        res.send({"Result":"Success"});
      }              
    });
  });
});

// Delete a pizza for chef
app.delete('/deletepizza', function(req, res)
{
  var pizzaID = req.body.pizzaID;
  var sql = "DELETE FROM pizza WHERE pizzaid = '" + pizzaID + "';" + "DELETE FROM pizzaingredient WHERE pizzaid = '" + pizzaID + "';"; 
  console.log(sql);

  myconnect = createConnection();

  myconnect.connect(function(err) 
  {
    if (err) throw err;
    myconnect.query(sql, function (err, result, fields) 
    {
      if(err){
        res.status(500).json("Invalid Data");
      }else{
        res.send({"Result":"Success"});
      }              
    });
  });
});


//Update a pizza for chef
app.patch('/updatepizza', function(req, res)
{
    var pizzaid = req.body.pizzaid;
    var pizzaname = req.body.pizzaname;
    var toppingID = req.body.toppingid;

    var toppingSQL = '';
    for (let i = 0; i < toppingID.length; i++) {
        toppingSQL += "INSERT INTO pizzaingredient (PizzaID, ToppingID) VALUE ('"+ pizzaid +"', '" + toppingID[i] + "');";
        //console.log(toppingID[i], toppingID);
    }

    var sql = "UPDATE pizza SET PizzaName = '" + pizzaname + "' WHERE pizzaID = '" + pizzaid + "';" + "DELETE FROM pizzaingredient WHERE pizzaid = '" + pizzaid + "';" + toppingSQL;
    console.log(sql);

    myconnect = createConnection();

    myconnect.connect(function(err) 
    {
        if (err) throw err;
        myconnect.query(sql, function (err, result, fields) 
        {
        if(err){
            res.status(500).json("Invalid Data");
        }else{
            res.send({"Result":"Success"});
        }              
        });
    });
});

const port = process.env.port || 3001;
app.listen(port, function(){
    console.log('Listenning from port 3001')
  });