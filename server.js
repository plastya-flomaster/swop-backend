const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');

const app = express();

//bodyparser midware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//config for DB
const db = require('./config/keys').mongoURI;

//db connection
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {console.log('connected!')})
.catch((err) => console.log(err));

//passport midware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//routes 
app.use('/api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server is running on port ${port}`)})