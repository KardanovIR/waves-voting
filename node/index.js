const express = require('express');
const app = express();
const cors = require('cors');
const nodeApi = require('./nodeApi');
const cron = require('node-cron');

const http = require('http');

app.use(cors());
app.use('/api', nodeApi);


cron.schedule('* * * * *', function(){
    http.get('http://localhost/api/v1/tokens/update/price');
});




app.listen(8080, () => console.log('App listening on port 8080!'));