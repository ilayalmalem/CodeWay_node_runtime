const {spawn} = require('child_process');const { v4 } = require('uuid');const url = require('url');const express = require('express');const cors = require('cors');const app = express();app.use(cors())
const port = require('portastic');

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
app.get('/get_container_id', async (req, res) => {
    let id = v4();
    let portID = randomIntFromInterval(4000, 7000); 
    
    console.log('running container')
    const child = spawn('docker', ['run',`--name`, id, '-p',`${portID}:3000` , 'cw_virtual_runtime'])
    child.stderr.on('data', m =>console.log(m.toString()))
    console.log('finished running container') 
    let ch = setInterval(
        () => {
            let checker = spawn('docker', ['container', 'inspect', `${id}`])
            checker.on('exit', (code) => {
                if(code == 0) {
                    console.log('Bye boi')
                    clearInterval(ch)
                    res.send({'cont_id': id, 'port': portID})
                }
            })
        }, 1500
    )
})

app.post('/kill_container', async (req, res) => {
    let containerId = (url.parse(req.url, true).query.cont_id);
    console.log(containerId)

    let ch = setInterval(() => {
        let checker = spawn('docker', ['rm', '-f', `${containerId}`])
        checker.on('exit', (code) => {
            if(code == 0) {
                console.log('Im dying.')
                clearInterval(ch)
                res.send({
                    status: 'success',
                    code: 200
                })
            }
        })
    }, 1000)
})

app.listen(6700, function () {
    console.log('Started the supervisor on port 6700')
})