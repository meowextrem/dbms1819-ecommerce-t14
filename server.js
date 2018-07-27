const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const PORT = (process.env.PORT || 3000);
const { Client } = require('pg');

const client = new Client({
	database: 'd4a1t26uo61u9i',
	user: 'mdlzczmoklcryg',
	password: '8f8922b5178ec5d254253001400ca4a66091ce7c975890b97b2fd8157334ec91',
	host: 'ec2-50-16-241-91.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
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

// tell express to use handebars XD
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	
	client.query("Select * FROM products", (req, data)=>{
		console.log(data.rows);
		res.render('product',{
			title: 'Products',
			products: data.rows,
		})
	});

});

app.listen(PORT, function() {
	console.log('Server started at port 3000');
});