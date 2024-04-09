const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/router');
const db = require('./config/dbConnection');
const app = express();
const path = require('path');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use('/files/images', express.static("files/images"));
app.use('/files/videos', express.static("files/videos"));

// Files URL
app.use(express.static(path.join(__dirname, "files")));


// API Routes
app.use('/api', indexRouter);

// Handling Errors
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));


// Start server after database connection is established
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Database connected successfully!');
});
