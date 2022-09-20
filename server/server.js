import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import {topScope, run} from './language/run.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
console.log('http://localhost:8000');

let logger = ""

topScope.print = value => {
    if(value)
    logger += value + '\n'
    return value
}

async function makeResponce(code) {
    return await run(code)
}

const app = express()
//const router = express.Router()
const server = http.createServer(app)
app.use('/', express.static(__dirname + '\\page'))

app.get('/', (req, res) => {
    res.end()
})



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.post('/', (req, res) => {
    logger = ""
    makeResponce(req.body.text).then(() => {
        res.send(JSON.stringify({text: logger}))
    }).catch(e => {
        res.send(JSON.stringify({text: e.toString() + '\n'}))
    }).finally()
    
})


server.listen(8000)