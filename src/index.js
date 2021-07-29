const express = require('express');
const dotenv = require('dotenv');
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(201).send(user);
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
})


app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send();

        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        es.status(400).send(err);
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
})

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send();

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})