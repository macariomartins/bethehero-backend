const app = require('./app');

var port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('This app is listening port ' + port);
});