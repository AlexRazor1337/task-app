const express = require('express');
const auth = require('..//middleware/auth');
const Task = require('../models/task')

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


router.get('/tasks', auth, async (req, res) => {
    try {
        const user = req.user;
        await user.populate('tasks').execPopulate()
        res.send(user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});


router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, user: req.user._id});
        if (!task) return res.status(404).send();

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, user: req.user._id});
        if (!task) return res.status(404).send();

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, user: req.user._id});

        if (!task) return res.status(404).send();

        res.send(task);
    } catch (e) {
        res.status(500).send(err);
    }
});

module.exports = router;