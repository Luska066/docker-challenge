const express = require('express');
require('dotenv').config();
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: 'root',
    password: 'root',
    database: 'app',
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        console.log('Fetched users:', results);
        const html = `
        <div>
            <h1>Insert username</h1>
            <form action="/insert-username" method="post">
                <input type="text" name="username">
                <button type="submit">Insert</button>
            </form>
            <br>
            <h1>Users</h1>
            <ul>
                ${results.map(user => {
                    return `<li>${user.name}</li>`
                }).join('')}
            </ul>
        </div>
    `
        res.send(html);
    });

});

app.get('/consult-users', (req, res) => {
  
})

app.post('/insert-username', (req,res) => {
    const name = req.body.username;
    const query = 'INSERT INTO users (name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error inserting username:', err);
        }
        console.log('Username inserted successfully');
        res.redirect('/');
    });
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});