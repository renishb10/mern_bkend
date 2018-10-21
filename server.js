const express = require('express');
const mongoose = require('mongoose');

//Import route files
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to Mongo DB
mongoose.connect(db)
    .then(() => console.log("Mongo DB connected!"))
    .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
