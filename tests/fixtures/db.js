const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1ID = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1ID,
    name: 'Mike',
    email: 'mike@mail.com',
    password: 'exmpasss',
    tokens: [{
        token: jwt.sign({ _id: user1ID}, process.env.SECRET)
    }]
}

const user2ID = new mongoose.Types.ObjectId()
const user2 = {
    _id: user2ID,
    name: 'Frank',
    email: 'frank@mail.com',
    password: 'exmpasss2',
    tokens: [{
        token: jwt.sign({ _id: user2ID}, process.env.SECRET)
    }]
}

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing this',
    completed: false,
    user: user1._id
}

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing that',
    completed: true,
    user: user1._id
}

const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'testing this that',
    completed: false,
    user: user2._id
}

const setupDB = async () => {
    await User.deleteMany()
    await new User(user1).save()
    await new User(user2).save()

    await Task.deleteMany()
    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports = {
    user1ID,
    user1,

    user2,

    task1,
    task2,
    task3,

    setupDB
}