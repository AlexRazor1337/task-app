const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;