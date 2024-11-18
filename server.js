const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/something', (req, res) => {
    res.send("you hit the something endpoint");
})

app.post('/form-submision', (req, res) => {
    console.log(req.body);
    res.send({message: 'yay you did it'});
})

app.listen(9000, () => console.log('listening on port 9000'));