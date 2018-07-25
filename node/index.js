const express = require('express');
const app = express();
const cors = require('cors');
const nodeApi = require('./nodeApi');
const CronJob = require('cron').CronJob;
const { Client } = require('pg');
const client = new Client();

const connection = await client.connect();

const http = require('http');

app.use(cors());
app.use('/api', nodeApi);



try {
    new CronJob('* * * * *',  () => {
        http.get('http://localhost/api/v1/votes/update/price');
    }, null, true);
} catch (ex) {
    console.log(ex);
}




app.listen(8080, () => console.log('App listening on port 8080!'));