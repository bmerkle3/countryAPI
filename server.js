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

app.post('/api/new-country', function(request, response) {
  var country_name = request.body.country_name;
  var language = request.body.language;
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        'INSERT INTO countries (country_name, language) VALUES($1, $2)',
        [countryName, language],
        (err, table) => {
          if (err) {
            return console.log(err);
          } else {
            console.log(table.rows);
            console.log('Data inserted');
            db.end();
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
