/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 1137;

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');
app.use(express.static('public'));
/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        let query1 = "SELECT * FROM Trainers;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('index', {data: rows});
        })
    });
    
app.get('/trainers', function(req, res)
{
    let query1 = `SELECT Trainers.trainer_id, Trainers.name AS trainer_name, Trainers.age, Regions.name AS region_name 
                  FROM Trainers 
                  INNER JOIN Regions ON Trainers.region_id = Regions.region_id;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('trainers', {data: rows});
    })
});

app.get('/update_trainer/:id', function(req, res)
{
    const trainerId = req.params.id;
    let query = `SELECT * FROM Trainers WHERE trainer_id = ?`;
    db.pool.query(query, [trainer_id], (error, rows) => {
        res.render('update_trainer', { trainer: rows[0]});
    });
});

app.get('/delete_trainer/:id', function(req, res) {
    const trainerId = req.params.id;
    let query = "DELETE FROM Trainers WHERE trainer_id = ?";
    db.pool.query(query, [trainerId], function(error, results) {
        res.redirect('/trainers');
    })
});

app.get('/pokemon', function(req, res)
{
    let query1 = `SELECT Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
                  FROM Pokemon
                  INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
                  INNER JOIN Regions ON Pokemon.region_id = Regions.region_id;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('pokemon', {data: rows});
    })
});

app.get('/delete_pokemon/:id', function(req, res) {
    const pokemonId = req.params.id;
    let query = "DELETE FROM Pokemon WHERE pokemon_id = ?";
    db.pool.query(query, [pokemonId], function(error, results) {
        res.redirect('/pokemon');
    })
});

app.get('/gyms', function(req, res)
{
    let query1 = `SELECT Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
                  FROM Gyms
                  INNER JOIN Regions ON Gyms.region_id = Regions.region_id;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('gyms', {data: rows});
    })
});

app.get('/delete_gyms/:id', function(req, res) {
    const gymId = req.params.id;
    let query = "DELETE FROM Gyms WHERE gym_id = ?";
    db.pool.query(query, [gymId], function(error, results) {
        res.redirect('/gyms');
    })
});

app.get('/regions', function(req, res)
{
    let query1 = `SELECT name
                  FROM Regions;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('regions', {data: rows});
    })
});

app.get('/trainerGyms', function(req, res)
{
    let query1 = `SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned
                  FROM TrainerGyms
                  INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('trainerGyms', {data: rows});
    })
});


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
