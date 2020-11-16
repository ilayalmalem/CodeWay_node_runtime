const {spawn} = require('child_process');const { v4 } = require('uuid');const url = require('url');const express = require('express');const cors = require('cors');const app = express();app.use(cors());
const randomIntFromInterval = (min, max) =>  Math.floor(Math.random() * (max - min + 1) + min);
app.get('/get_container_id', async (req, res) => {
    let id = v4();
    let portID = randomIntFromInterval(1000, 100000); 
    
    const child = spawn('docker', ['run',`--name`, id, '-p',`${portID}:3000` , 'cw_virtual_runtime'])

    child.stderr.on('data', m =>console.log(m.toString())) 

    let ch = setInterval(() => {
        let checker = spawn('docker', ['container', 'inspect', `${id}`])
        checker.on('exit', code => {
            if(code == 0) {
                clearInterval(ch)
                res.send({'cont_id': id, 'port': portID})
            }
        })
    }, 2500)
})

app.post('/kill_container', async (req, res) => {
    var containerId = (url.parse(req.url, true).query.cont_id);
    let ch = setInterval(() => {
        let checker = spawn('docker', ['rm', '-f', `${containerId}`])
        checker.on('exit', (code) => {
            if(code == 0) {
                clearInterval(ch)
                res.send({
                    status: 'success',
                    code: 200
                })
            }
        })
    }, 1000)
})

app.listen(6700, () => console.log('Started the supervisor on port 6700'))