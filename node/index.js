const express = require('express');
const app = express();
const cors = require('cors');
const nodeApi = require('./nodeApi');
const CronJob = require('cron').CronJob;
const config = require('../v1-config');

const { Pool } = require('pg');

const pool = new Pool({
    user: config.local.db.user,
    host: config.local.db.host,
    database: config.local.db.database,
    password: config.local.db.password
});

const https = require('https');

app.use(cors());
app.use('/api', nodeApi);

updateBalances = () => {
    pool.connect()
      .then(client => {
          return client.query('SELECT * FROM votes', [])
            .then(res => {
                console.log('Got addresses: ' + res.rows.length); // Hello World!
                res.rows.forEach((vote) => {
                    const url = `https://nodes.wavesplatform.com/assets/balance/${vote.address}/DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J`;
                    https.get(url, function (res) {
                        var body = '';
                        
                        res.on('data', function (chunk) {
                            body += chunk;
                        });
                        
                        res.on('end', function () {
                            var response = JSON.parse(body);
                            console.log(response.balance);
                            client.query('UPDATE votes SET wct_balance = $1 WHERE address = $2', [response.balance, vote.address]);
                        });
                    }).on('error', function (e) {
                        console.log("Got an error: ", e);
                    });
                });
                
            })
            .catch(e => {
                client.release();
                console.log(e)
            })
      });
};

// try {
//     new CronJob('*/15 * * * *', () => {
//         // updateBalances();
//     }, null, true);
// } catch (ex) {
//     console.log(ex);
// }

updateBalances();
app.listen(8080, () => console.log('App listening on port 8080!'));