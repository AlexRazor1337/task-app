const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

require('./db/mongoose')


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


const multer = require('multer');
const upploadMidleware = (req, res, next) => {
    throw new Error('From MW');
}

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1024 * 1024 // 1mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            cb(new Error('Wrong file extension'));
        }

        cb(undefined, true)
    }
});


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({error: err.message});
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
