const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

const users = require('./routes/api/users');
const items = require('./routes/api/items');
const likedItems = require('./routes/api/likedItems');
const categories = require('./routes/api/categories');

const app = express();

const domain = 'http://localhost:8080';

const corsOpts = {
  origin: domain,
};

app.use(cors(corsOpts));

//bodyparser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.json({ message: 'hello node its plastya' });
});

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

//конфиг DB
const db = require('./config/keys').mongoURI;

//db подключение
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Подключено к базе!'))
  .catch((err) => {
    console.log('Подключение невозможно');
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
app.use('/api/likeditems', likedItems);
app.use('/api/categories', categories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`сервер запущен на порту ${port}`);
});
