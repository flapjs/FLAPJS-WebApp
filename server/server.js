const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => res.sendfile(path.join(__dirname, '/public/index.html')));

app.use(express.static(__dirname + '/public'));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
