const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const PORT = (process.env.PORT || 3000);
const { Client } = require('pg');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
const replaceString = require('replace-string');
var S = require('string');

const client = new Client({
	database: 'd4a1t26uo61u9i',
	user: 'mdlzczmoklcryg',
	password: '8f8922b5178ec5d254253001400ca4a66091ce7c975890b97b2fd8157334ec91',
	host: 'ec2-50-16-241-91.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
});

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "dbmsteam14",
        pass: "1Got1Udont!"
    }
});

client.connect().then(function() {
	console.log('connected to database!')
}).catch(function(err) {
	console.log('cannot connect to database!')
});

const app = express();
// tell express which folder is a static/public folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('pictures'));
app.use('/static', express.static(path.join(__dirname, 'pictures')))

// tell express to use bodyparse to parse application/json
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// tell express to use handebars XD
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	
	client.query("Select * FROM products ORDER BY id ASC", (req, data)=>{
		console.log(data.rows);
		
		res.render('product',{
			title: 'Products',
			products: data.rows,
		});
	});

});

// app.post('/product/id', urlencodedParser, function (req, res) {
//    // Prepare output in JSON format
//    response = {
//       first_name:req.body.first_name,
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })



app.get('/product/id', function(req,res){
	res.redirect('/');
});

app.post('/form', function(req,res){
	console.log(req.body);

	var mailOptions={
        to : req.body.email,
        subject : "Order confirmation",
        text : 'Your order has been successfuly received.'
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
		}else{
			res.render('emailsent');
		}
	});

    var textBody = req.body.name + '\n' + req.body.number+'\n'+ req.body.idproduct + ' : '+req.body.quantity +"\nAddress : " +req.body.address +'\n'+req.body.order_request;
	var mailOptions={
        to : 'dbmsteam14@gmail.com',
        from: req.body.email,
        subject : "New Order",
        text : textBody
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
		}else{
			res.render('emailsent');
		}
	});

});


app.get('/form', function(req,res){
	res.render('form')
});


app.get('/brand/create', function(req,res){
	res.render('brand_create');
});


app.get('/brands',function(req,res){
	client.query("SELECT * FROM brands;", (req, data)=>{
		console.log(data.rows);
		
		res.render('brand_lists',{
			brands: data.rows,
		});
		
	});
});

app.get('/category/create', function(req,res){
	res.render('category_create');
});

app.get('/categories',function(req,res){
	client.query("SELECT * FROM product_category;", (req, data)=>{
		console.log(data.rows);
		
		res.render('categories',{
			categories: data.rows,
		});
		
	});
});


app.get('/product/create', function(req,res){
	res.render('product_create');
});


app.post('/product/id', function (req, res) {
	//var obj = (JSON.stringify(req.body));

	console.log(req.body.product_name);
	console.log(req.body.product_price);
	console.log(req.body.product_primary_picture);
	var product_description = req.body.product_description;
	res.render('form',{
		product_name: req.body.product_name,
		product_price: req.body.product_price,
		product_primary_picture: req.body.product_primary_picture,
		product_description : product_description,
		product_uid: req.body.product_uid,
		product_type: req.body.product_type,
		product_brand: req.body.product_brand
	});
});

app.post('/brand/create', function(req,res){
	brand_name = req.body.brand_name;
	brand_description = req.body.brand_description;

	var query = 'INSERT INTO brands (name,description) VALUES($1,$2);';
	var values = new Array();
	values.push(brand_name);
	values.push(brand_description);
	console.log(values);
	client.query(query,values, (req, data)=>{
		res.redirect('/brands');
	});

});

app.post('/category/create', function(req,res){
	category_name = req.body.category_name;

	var query = 'INSERT INTO product_category (name) VALUES ($1);';
	var values = new Array();
	values.push(category_name);
	console.log(values);
	client.query(query,values, (req, data)=>{
		res.redirect('/categories');
	});

});


app.listen(PORT, function() {
	console.log('Server started at port 3000');
});