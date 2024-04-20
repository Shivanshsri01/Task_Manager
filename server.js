const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3006;
;

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection configuration 
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database', err));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





app.post('/save-task', (req, res) => {
    const { date, task , status } = req.body; // Extract date and task from request body
    console.log('Received task data:', { date, task , status}); // Debugging
    
    const query = 'INSERT INTO tasks (date, task, status) VALUES ($1, $2 , $3)';
    const values = [date, task , status];
    
    client.query(query, values)
        .then(() => {
            console.log('Task saved successfully');
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Error saving task:', err);
            res.status(500).json({ success: false, error: err.message });
        });
});

// Start the server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
});


