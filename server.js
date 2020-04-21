const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');

const users = require('./routes/api/users');

const app = express();

const domain =  'http://localhost:8080';

//bodyparser midware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

//midware for images
app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        console.log(filename + '--' + fieldname);
        return filename;
    },
   }));
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
app.use('/api', require('./routes/api/items'));

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server is running on port ${port}`)});