import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import express from 'express'
import { Server } from 'socket.io';
import { createServer } from 'http';

//Даные
var data = JSON.parse(fs.readFileSync('riciepts.json', 'utf8'));

//Canvas
const width = 800
const height = 800

//Header
let title
let featuredImage
let productList

//Step
let numberStep
let imageStep
let textStep

//Конфигурация сервера
const __dirname = path.resolve()
const PORT = 3000
const app = express()
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs') //Использовать ejs для views
app.use(express.static('views')) //Подключать статические файлы из папки views

app.get('/step', (req, res) => {
    res.render('step_new', {})
})
app.get('/header', (req, res) => {
    res.render('header_new', {})
})

io.on("connection", (socket) => {
    socket.send(
        {
            titleRecipe: title,
            products: productList,
            featuredImage: featuredImage,

            numberStep: numberStep,
            textStep: textStep,
            imageStep: imageStep,
        })
    socket.on('greeting', (data) => {
        //console.log(data)
    })
})

server.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})

for (let res in data) {
    let subObj = data[res];
    for (let subKey in subObj) {
        if (subKey == 'header') {
            //console.log('Обработка Превью...')
            let header = subObj[subKey]

            title = header['title']
            featuredImage = header['image']
            productList = header['products']

            await createHeader()
        } else {
            //console.log('Обработка Шага ' + subKey + '...')
            let step = subObj[subKey]
            numberStep = subKey

            imageStep = step['image']
            textStep = step['text']

            await createStep()
        }
    }
}

//Create Header
async function createHeader() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setViewport({ width: width, height: height })
    await page.goto('http://localhost:3000/header', { "waitUntil": "networkidle0" });
    //await page.waitForSelector('.bg');                                               // дожидаемся загрузки картинки
    await page.screenshot({ path: `0 - ${title.replace(/[/\\?%*:|"<>]/g, '')}.png` }); // делаем скриншот 
    await browser.close();                                                             // закрываем браузер
}


//Create Step
async function createStep() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setViewport({ width: width, height: height })
    await page.goto('http://localhost:3000/step', { "waitUntil": "networkidle0" });
    //await page.waitForSelector('.bg');          // дожидаемся загрузки картинки
    await page.screenshot({ path: `${numberStep} - ${title.replace(/[/\\?%*:|"<>]/g, '')}.png` }); // делаем скриншот 
    await browser.close();                          // закрываем браузер
}



