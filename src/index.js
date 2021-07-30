const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

require('./db/mongoose')


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

const myFunction = async () => {
    const password = 'TestPass';
    const hashed = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hashed);

    const isMatch = await bcrypt.compare('TestPass', hashed)
    console.log(isMatch);
}

myFunction()