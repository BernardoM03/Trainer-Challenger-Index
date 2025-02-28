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

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
