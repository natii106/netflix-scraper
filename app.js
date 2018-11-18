const express = require('express');
const app = express();
const controller = require('./controller');

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


app.use('/', controller);


module.exports = app;
