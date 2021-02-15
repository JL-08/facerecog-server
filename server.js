const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: process.env.DATABASE_CLIENT,
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE_NAME,
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.user);
});

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app connected on port ${PORT}`);
});
