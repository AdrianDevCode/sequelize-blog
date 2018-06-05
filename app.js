// ! Remember to `npm init`, create a db and rename the '.env.example' file to '.env'!
const dotenv = require('dotenv');
const express = require('express');
const Sequelize = require('sequelize');

dotenv.load();
const PORT = process.env.PORT || 3000;
const db = {
    pass: process.env.POSTGRES_PASS,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    name: process.env.POSTGRES_DB_NAME,
}
const sequelize = new Sequelize(`postgres://${db.user}:${db.pass}@${db.host}:5432/${db.name}`);
// ! This next line is insecure- Be sure not to accidentally share your password!
// const sequelize = new Sequelize('postgres://postgres@localhost:5432/blog');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser({ urlencoded: true }));

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
});

//? Only need to run this once
// User.sync().then(() => {
//     User.create({
//         username: 'jimmy',
//         password: 'bananapancake',
//     });
// })

// send empty response on homepage
app.get('/', (req, res) => {
    res.json({});
})

// get all users
app.get('/users', (req, res) => {
    User.findAll().then(users => {
        res.json(users);
    })
})

// get single user by url param (i.e. '/user/lachlan')
app.get('/user/:username', (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(users => {
        res.json(users.rows);
    })
})

// create new user via post data
app.post('/create', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    });
});

// update existing user via post data
app.post('/update', (req, res) => {
    User.update({
        'password': req.body.password,
    }, {
            where: {
                username: req.body.username,
            }
        }).then(user => {
            res.json({ 'success': true });
        })
});

// delete user via post data
app.post('/delete', (req, res) => {
    User.destroy({
        where: {
            username: req.body.username,
        }
    }).then(user => {
        res.json({ 'success': true });
    })
});

app.listen(PORT, () => {
    console.log('listening on port 3000');
})
