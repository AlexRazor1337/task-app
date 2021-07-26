const express = require('express');
const dotenv = require('dotenv');
require('./db/mongoose')

const User = require('./models/user')
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})