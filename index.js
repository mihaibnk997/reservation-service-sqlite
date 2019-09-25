const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');

let db = new sqlite3.Database('./mydb.db', (err)=> {
    if(err) {
        console.log(err.message);
    }
    console.log('connected to my db in sqlite');

    // db.close((err)=> {
    //     if(err) {
    //         console.log(err.message);
    //     }
    // })

    // console.log('mydb connection closed');
})


const app = express();

app.use(bodyParser.json());

//Get all Resources
app.get('/resources', (req, res) => {
    
    db.all('SELECT * FROM resources', [], (err, rows) => {
        if (err) {
            console.log(err.message)
        }
        rows.forEach((row) => {
          console.log(row);
        });
        res.json(rows);
    });
})

// Get a particular resource
app.get('/resources/:id', (req, res)=> {
    const lookupId = req.params.id;

    db.get('SELECT * FROM resources WHERE resource_id = ?', [lookupId], (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        return row
          ? res.json(row)
          : res.json(`No resource found with the id ${lookupId}`); 
      });
})

// Delete a particular resource
app.delete('/resources/:id', (req, res)=> {
    const lookupId = req.params.id;

    db.run('DELETE FROM resources WHERE resource_id = ?', [lookupId], (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        res.json('Deleted successfully') 
      });
})

// Insert a particular resource
app.post('/resources', (req, res)=> {
    console.log(req.body);
    db.run(`INSERT INTO resources(resource_id, resource_name) VALUES(?, ?)`, [req.body.resource_id, req.body.resource_name], function(err) {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json('Inserted').status(200);
      });
})

// Update a resource
app.put('/resources', (req, res)=> {
    const lookupId = req.body.resource_id;
    const newName = req.body.resource_name;

    db.run('UPDATE resources SET resource_name = ? WHERE resource_id = ?', [newName, lookupId], (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        res.json('Modified successfully') 
      });
})


//Get all Reservations
app.get('/reservations', (req, res) => {
    
    db.all('SELECT * FROM reservations', [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row);
        });
        res.json(rows);
    })
})

// Get a particular reservation
app.get('/reservations/:id', (req, res)=> {
    const lookupId = req.params.id;

    db.get('SELECT * FROM reservations WHERE reservation_id = ?', [lookupId], (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        return row
          ? res.json(row)
          : res.json(`No resource found with the id ${lookupId}`); 
      });
})

// Delete a particular reservation
app.delete('/reservations/:id', (req, res)=> {
    const lookupId = req.params.id;

    db.run('DELETE FROM reservations WHERE reservation_id = ?', [lookupId], (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        res.json('Deleted successfully') 
      });
})

// Insert a particular reservation
app.post('/reservations', (req, res)=> {
    console.log(req.body);
    db.run(`INSERT INTO reservations(reservation_id, start_date, end_date, resource_id, owner_email, comments) VALUES(?, ?, ?, ?, ?, ?)`, 
    [
    req.body.reservation_id, 
    req.body.start_date,
    req.body.end_date, 
    req.body.resource_id, 
    req.body.owner_email, 
    req.body.comments, 
    ], 
    function(err) {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json('Inserted').status(200);
      });
})

// Update a reservation
app.put('/reservations', (req, res)=> {
    const lookupId = req.body.resource_id;
    // const newName = req.body.resource_name;
    console.log(req.body);

    const query = 'UPDATE reservations SET comments = ? WHERE reservation_id = ?';
    const query2 = 'UPDATE reservations SET start_date = ?, end_date = ?, resource_id = ?, owner_email = ?, comments = ? WHERE reservation_id = ?';
    
    db.run(query2, 
    [
        req.body.start_date, 
        req.body.end_date, 
        req.body.resource_id,
        req.body.owner_email,
        req.body.comments,
        lookupId
    ], 
    (err, row) => {
        if (err) {
            res.json('Something went wrong').status(400);
            return console.error(err.message);
        }
        res.json('Modified successfully') 
      });
})


app.listen(3000, () => {
    console.log('app is running on port 3000');
})

// CREATE TABLE reservations (
//     reservation_id INT PRIMARY KEY NOT NULL,
//     start_date DATE NOT NULL,
//     end_date DATE NOT NULL,
//     resource_id INT NOT NULL REFERENCES resources(resource_id),
//     owner_email VARCHAR(50) NOT NULL,
//     comments VARCHAR(50)
//   );

//   CREATE TABLE resources (
//     resource_id INT PRIMARY KEY NOT NULL,
//     resource_name VARCHAR(50) NOT NULL UNIQUE
//   );

//   INSERT INTO resources(resource_id, resource_name) VALUES(11, 'room');
//   INSERT INTO resources(resource_id, resource_name) VALUES(22, 'second room');

//   INSERT INTO reservations(reservation_id, start_date, end_date, resource_id, owner_email, comments) VALUES(1, '2019-09-01', '2019-09-03', 12, 'owner1@gmail.com', 'no comments');