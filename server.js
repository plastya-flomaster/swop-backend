const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const cors = require('cors');

const users = require('./routes/api/users');
const items = require('./routes/api/items');

const app = express();

const domain =  'http://localhost:8080';


const corsOpts = {
    origin: domain
}

app.use(cors(corsOpts));

//bodyparser
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.get('/', (req, res) => { res.json({message: 'hello node its plastya'});
});

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     next();
//   });



//config for DB
const db = require('./config/keys').mongoURI;

//db connection
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
})
.then(() => console.log('db is connected!'))
.catch((err) => {
    console.log('cannot connect');
    console.log(err);
    process.exit();
});

//passport midware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//routes 
app.use('/api/users', users);
app.use('/api/items', items);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server is running on port ${port}`)});