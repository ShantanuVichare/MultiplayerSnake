
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// if (process.env.NODE_ENV !== 'production'){
//     app.use(require('cors')());
// }

app.use(express.json());

console.log('NODE_ENV: ', process.env.NODE_ENV);
console.log("Loaded directory:",__dirname);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);

