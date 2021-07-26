const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.post('/users', (req, res) => {
    console.log(req.body);
    res.send('test')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})