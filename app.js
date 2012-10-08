var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var port = 1337;


app.configure(function(){

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
  res.render('index.jade', { locals: {
      
    }
  });
});

app.get('/getSurvivors', function (req, res) {
  getSurvivors(function(data) {
  	res.json(data);
  });
});

function getSurvivors(callback) {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'asd',
	  user     : 'asd',
	  password : 'asd',
	  database : 'asd'
	});

	connection.connect();

	connection.query('SELECT * FROM dayzlingor.survivor INNER JOIN dayzlingor.profile ON dayzlingor.survivor.unique_id = dayzlingor.profile.unique_id  WHERE is_dead = 0 AND last_update > NOW() - 60;', function(err, rows, fields) {
	  if (err) throw err;

	  callback(rows);
	});

	connection.end();
}

app.listen(port);
console.log('Listening on port 3000');