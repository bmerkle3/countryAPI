let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3000;

let pool = new pg.Pool({
  port: 5432,
  password: '007007',
  database: 'countries',
  max: 10,
  host: 'localhost',
  user: 'braidymerkle'
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// allows us to request from react (client-side) back to postgres/express api

app.get('/api/countries', function(request, response) {
  pool.connect(function(err, db, done) {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query('SELECT * FROM countries', function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        } else {
          return response.status(200).send(table.rows);
        }
      });
    }
  });
});

app.post('/api/new-country', function(request, response) {
  var country_name = request.body.country_name;
  var language = request.body.language;
  var key = request.body.key;
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query(
        'INSERT INTO countries (country_name, language, key) VALUES($1, $2, $3)',
        [country_name, language, key],
        (err, table) => {
          if (err) {
            return response.status(400).send(err);
          } else {
            console.log('Data inserted');
            db.end();
            response.status(201).send({ message: 'Data inserted' });
          }
        }
      );
      // db.query(
      //   'INSERT INTO countries (country_name, language, key) VALUES($1, $2, $3)',
      //   [countryName, language, int],
      //   (err, table) => {
      //     if (err) {
      //       return console.log(err);
      //     } else {
      //       console.log('successfully inserted data');
      //       db.end();
      //     }
      //   }
      // );
    }
  });
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));
