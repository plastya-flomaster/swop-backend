const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//bodyparser
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

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server is running on port ${port}`)})