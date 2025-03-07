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
PORT = 3453;
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
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
        //console.log("Fetched trainers:", trainers)
        db.pool.query(query2, function (error, rows, fields) {
            let regions = rows;
            //console.log("Fetched regions:", regions); // DEBUGGING LINE
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

app.put('/update-trainer', function (req, res, next) {
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
                console.log("Fetched Trainers:", trainers); // Debug log
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

app.get('/delete_gyms/:id', function (req, res) {
    const gymId = req.params.id;
    let query = "DELETE FROM Gyms WHERE gym_id = ?";
    db.pool.query(query, [gymId], function (error, results) {
        res.redirect('/gyms');
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

app.get('/delete_regions/:id', function(req, res) {
    const regionId = req.params.id;
    let query = "DELETE FROM Regions WHERE region_id = ?";
    db.pool.query(query, [regionId], function(error, results) {
        res.redirect('/regions');
    })
});

app.get('/trainerGyms', function (req, res) {
    let query1 = `SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned
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
        if (error) {
            console.error("Error inserting into TrainerGyms:", error);
            return res.status(500).send({ error: "Database insert error" });
        }

        console.log("Inserted TrainerGym record successfully");

        let query2 = `
            SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned
            FROM TrainerGyms
            INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id
            WHERE TrainerGyms.trainer_id = ? AND TrainerGyms.gym_id = ?;`;

        db.pool.query(query2, [data.trainer, data.gym], function (error, rows) {
            if (error) {
                console.error("Error retrieving inserted record:", error);
                return res.status(500).send({ error: "Database select error" });
            }

            if (rows.length === 0) {
                console.warn("No records found for trainer_id:", data.trainer, "gym_id:", data.gym);
                return res.status(404).send({ error: "No matching records found" });
            }

            console.log("Retrieved inserted record successfully:", rows);
            res.send(rows);
        });
    });
});


/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
