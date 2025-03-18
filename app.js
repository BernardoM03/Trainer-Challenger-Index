/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 3455;
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.engine('.hbs', engine({
    extname: ".hbs",
    helpers: {
        formatDate: function (date) {
            if (!date) return "N/A";
            return new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    }
}));
app.set('view engine', '.hbs');
/*
    ROUTES
*/
app.get('/', function (req, res) {
    res.render('index');
});


app.get('/trainers', function (req, res) {
    let query1 = "SELECT Trainers.trainer_id, Trainers.name AS trainer_name, Trainers.age, Regions.name AS region_name FROM Trainers INNER JOIN Regions ON Trainers.region_id = Regions.region_id;";
    let query2 = "SELECT * FROM Regions;"
    db.pool.query(query1, function (error, rows, fields) {
        let trainers = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let regions = rows;
            res.render('trainers', { data: trainers, regions: regions });
        })
    })
});

app.post('/add-trainer', function (req, res) {
    let data = req.body;
    console.log(data);
    let region = parseInt(data.region);
    if (isNaN(region)) { region = 'NULL'; }
    let age = parseInt(data.age);
    if (isNaN(age)) { age = 'NULL'; }

    let query1 = `INSERT INTO Trainers (name, age, region_id) VALUES (?, ?, ?)`;
    db.pool.query(query1, [data.name, age, region], function (error, results) {
        let query2 = "SELECT Trainers.trainer_id, Trainers.name AS trainer_name, Trainers.age, Regions.name AS region_name FROM Trainers INNER JOIN Regions ON Trainers.region_id = Regions.region_id WHERE Trainers.trainer_id = ?";
        db.pool.query(query2, [results.insertId], function (error, rows) {
            res.send(rows);
        });
    });
});

app.put('/update-trainers', function (req, res, next) {
    let data = req.body;
    console.log("fetched data:", data)

    let region = parseInt(data.region);
    if (isNaN(region)) { region = null; }
    let age = parseInt(data.age);
    if (isNaN(age)) { age = null; }

    let query1 = "UPDATE Trainers SET name = ?, age = ?, region_id = ? WHERE trainer_id = ?";
    db.pool.query(query1, [data.name, age, region, data.trainer_id], function (error, results) {
        let query2 = "SELECT Trainers.trainer_id, Trainers.name AS trainer_name, Trainers.age, Regions.name AS region_name FROM Trainers INNER JOIN Regions ON Trainers.region_id = Regions.region_id WHERE Trainers.trainer_id = ?";
        db.pool.query(query2, [data.trainer_id], function (error, rows) {
            res.send(rows);
        });
    });
});

app.get('/delete_trainer/:id', function (req, res) {
    const trainerId = req.params.id;
    let query = "DELETE FROM Trainers WHERE trainer_id = ?";
    db.pool.query(query, [trainerId], function (error, results) {
        res.redirect('/trainers');
    })
});

app.get('/regions', function (req, res) {
    let query1 = `SELECT region_id, name FROM Regions;`;
    db.pool.query(query1, function (error, rows, fields) {
        res.render('regions', { data: rows });
    })
});

app.post('/add-regions', function (req, res) {
    let data = req.body;
    console.log(data);

    let query1 = `INSERT INTO Regions (name) VALUES (?)`;
    db.pool.query(query1, [data.name], function (error, results) {
        let query2 = `SELECT region_id, name FROM Regions WHERE region_id = ?;`;
        db.pool.query(query2, [results.insertId], function (error, rows) {
            res.send(rows);
        });
    });
});

app.put('/update-regions', function (req, res, next) {
    let data = req.body;
    console.log("fetched data:", data)

    let query1 = "UPDATE Regions SET name = ? WHERE region_id = ?";
    db.pool.query(query1, [data.name, data.region_id], function (error, results) {
        let query2 = "SELECT region_id, name FROM Regions WHERE region_id = ?;";
        db.pool.query(query2, [data.region_id], function (error, rows) {
            res.send(rows);
        });
    });
});

app.get('/delete_regions/:id', function(req, res) {
    const regionId = req.params.id;
    let query = "DELETE FROM Regions WHERE region_id = ?";
    db.pool.query(query, [regionId], function(error, results) {
        res.redirect('/regions');
    })
});

app.get('/pokemon', function (req, res) {
    let query1 = `SELECT Pokemon.pokemon_id, Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
                  FROM Pokemon
                  INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
                  INNER JOIN Regions ON Pokemon.region_id = Regions.region_id;`;
    let query2 = "SELECT * FROM Regions;"
    let query3 = "SELECT * FROM Trainers"
    db.pool.query(query1, function (error, rows, fields) {
        let pokemon = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let regions = rows;
            db.pool.query(query3, function (error, rows, fields) {
                let trainers = rows;
                res.render('pokemon', { data: pokemon, regions: regions, trainers: trainers });
            })
        })
    })
});

app.post('/add-pokemon', function (req, res) {
    let data = req.body;
    console.log(data);
    let region = parseInt(data.region);
    if (isNaN(region)) { region = 'NULL'; }

    let query1 = `INSERT INTO Pokemon (name, type, region_id, trainer_id) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.name, data.type, region, data.trainer], function (error, results) {
        let query2 = `SELECT Pokemon.pokemon_id, Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
                  FROM Pokemon
                  INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
                  INNER JOIN Regions ON Pokemon.region_id = Regions.region_id
                  WHERE Pokemon.pokemon_id = ?;`;
        db.pool.query(query2, [results.insertId], function (error, rows) {
            res.send(rows);
        });
    });
});

app.put('/update-pokemon', function (req, res, next) {
    let data = req.body;
    console.log("fetched data:", data)

    let region = parseInt(data.region);
    if (isNaN(region)) { region = 'NULL'; }

    let query1 = "UPDATE Pokemon SET name = ?, type = ?, region_id = ?, trainer_id = ? WHERE pokemon_id = ?";
    db.pool.query(query1, [data.name, data.type, region, data.trainer, data.pokemon_id], function (error, results) {
        let query2 = `SELECT Pokemon.pokemon_id, Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
                  FROM Pokemon
                  INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
                  INNER JOIN Regions ON Pokemon.region_id = Regions.region_id
                  WHERE Pokemon.pokemon_id = ?;`;
        db.pool.query(query2, [data.pokemon_id], function (error, rows) {
            res.send(rows);
        });
    });
});

app.get('/delete_pokemon/:id', function (req, res) {
    const pokemonId = req.params.id;
    let query = "DELETE FROM Pokemon WHERE pokemon_id = ?";
    db.pool.query(query, [pokemonId], function (error, results) {
        res.redirect('/pokemon');
    })
});

app.get('/gyms', function (req, res) {
    let query1 = `SELECT Gyms.gym_id, Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
                  FROM Gyms
                  INNER JOIN Regions ON Gyms.region_id = Regions.region_id;`;
    let query2 = "SELECT * FROM Regions;"
    db.pool.query(query1, function (error, rows, fields) {
        let gyms = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let regions = rows;
            res.render('gyms', { data: gyms, regions: regions });
        })
    })
});

app.post('/add-gym', function (req, res) {
    let data = req.body;
    console.log(data);
    
    let region = parseInt(data.region);
    if (isNaN(region)) { region = null; } 

    let query1 = `INSERT INTO Gyms (name, type, region_id) VALUES (?, ?, ?)`;
    db.pool.query(query1, [data.name, data.type, region], function (error, results) {

        let query2 = `SELECT Gyms.gym_id, Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
                      FROM Gyms
                      LEFT JOIN Regions ON Gyms.region_id = Regions.region_id
                      WHERE Gyms.gym_id = ?`;

        db.pool.query(query2, [results.insertId], function (error, rows) {
            res.send(rows);
        });
    });
});

app.put('/update-gyms', function (req, res, next) {
    let data = req.body;
    console.log("fetched data:", data)

    let region = parseInt(data.region);
    if (isNaN(region)) { region = 'NULL'; }

    let query1 = "UPDATE Gyms SET name = ?, type = ?, region_id = ? WHERE gym_id = ?";
    db.pool.query(query1, [data.name, data.type, region, data.gym_id], function (error, results) {
        let query2 = `SELECT Gyms.gym_id, Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
                      FROM Gyms
                      LEFT JOIN Regions ON Gyms.region_id = Regions.region_id
                      WHERE Gyms.gym_id = ?`;
        db.pool.query(query2, [data.gym_id], function (error, rows) {
            res.send(rows);
        });
    });
});

app.get('/delete_gyms/:id', function (req, res) {
    const gymId = req.params.id;
    let query = "DELETE FROM Gyms WHERE gym_id = ?";
    db.pool.query(query, [gymId], function (error, results) {
        res.redirect('/gyms');
    })
});

app.get('/trainerGyms', function (req, res) {
    let query1 = `SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned, TrainerGyms.trainer_id, TrainerGyms.gym_id
                  FROM TrainerGyms
                  INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id;`;
    let query2 = "SELECT * FROM Gyms"
    let query3 = "SELECT * FROM Trainers"
    db.pool.query(query1, function (error, rows, fields) {
        let trainergym = rows;
        db.pool.query(query2, function (error, rows, fields) {
            let gyms = rows;
            db.pool.query(query3, function (error, rows, fields) {
                let trainers = rows;
                res.render('trainerGyms', { data: trainergym, gyms: gyms, trainers:trainers });
            })
        })
    })
});

app.post('/add-trainergym', function (req, res) {
    let data = req.body;
    console.log("Received data:", data);

    let query1 = `INSERT INTO TrainerGyms (trainer_id, gym_id, badge_name, date_earned) VALUES (?, ?, ?, ?);`;
    
    db.pool.query(query1, [data.trainer, data.gym, data.name, data.date], function (error, results) {

        let query2 = `
            SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned, TrainerGyms.trainer_id, TrainerGyms.gym_id
            FROM TrainerGyms
            INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id
            WHERE TrainerGyms.trainer_id = ? AND TrainerGyms.gym_id = ?;`;

        db.pool.query(query2, [data.trainer, data.gym], function (error, rows) {
            res.send(rows);
        });
    });
});

app.put('/update-trainergyms', function (req, res, next) {
    let data = req.body;
    console.log("fetched data:", data)

    let query1 = "UPDATE TrainerGyms SET badge_name = ?, gym_id = ?, trainer_id = ?, date_earned = ? WHERE gym_id = ? AND trainer_id = ?";
    db.pool.query(query1, [data.badge_name, data.gym_id, data.trainer_id, data.date, data.gym, data.trainer], function (error, results) {
        //console.log("Query Params - Trainer ID:", data.trainer, "Gym ID:", data.gym);
        let query2 = `
            SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned, TrainerGyms.trainer_id, TrainerGyms.gym_id
            FROM TrainerGyms
            INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id
            WHERE TrainerGyms.trainer_id = ? AND TrainerGyms.gym_id = ?;`;
        db.pool.query(query2, [data.trainer, data.gym], function (error, rows) {
            res.send(rows);
        });
    });
});

app.get('/delete_trainerGym/:trainer_id/:gym_id', function(req, res) {
    const trainerId = req.params.trainer_id;
    const gymId = req.params.gym_id;

    let query = "DELETE FROM TrainerGyms WHERE trainer_id = ? AND gym_id = ?";
    
    db.pool.query(query, [trainerId, gymId], function(error, results) {
        res.redirect('/trainerGyms');
    });
});


/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
