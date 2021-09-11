import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import express from 'express'

//Конфигурация сервера
const __dirname = path.resolve()
const PORT = 3000
const app = express()

app.set('view engine', 'ejs') //Использовать ejs для views
app.use(express.static('views')) //Подключать статические файлы из папки views

app.get('/step', (req, res) => {
    res.render('step', {})
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})

//Даные
var data = JSON.parse(fs.readFileSync('riciepts.json', 'utf8'));

/*
//Даные
var data = [
    'https://know-online.com/post/nodejs-post',
    'https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop'
]


async function printFiles() {

    for (const link of data) {
        console.log(`ссылка ${link}`)
        await createScreenshot(link);
    }
}

async function createScreenshot(link) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 800
    })
    await page.goto(link);
    await page.screenshot({ path: `test.png` }); // делаем скриншот 
    await browser.close();                          // закрываем браузер

    console.log(`скрин готов ${link}`)
}

printFiles()




for (const link in data) {
    console.log(`ссылка ${data[link]}`)
    await createScreenshot(data[link]);
}


async function createScreenshot(link) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 800
    })
    await page.goto(link);
    await page.screenshot({ path: `test.png` }); // делаем скриншот 
    await browser.close();                          // закрываем браузер

    console.log(`скрин готов ${link}`)
}
*/

//Header
let title
let featuredImage
let productList

//Step
let imageStep
let textStep

for (let res in data) {
    let subObj = data[res];
    for (let subKey in subObj) {
        if (subKey == 'header') {
            //console.log('Обработка Превью...')
            let header = subObj[subKey]

            title = header['title']
            featuredImage = header['image']
            productList = header['products']

            console.log(`Создание хидера`)
            await createHeader(title, featuredImage, productList)
        } else {
            //console.log('Обработка Шага ' + subKey + '...')
            let step = subObj[subKey]
            let stepNumber = subKey

            imageStep = step['image']
            textStep = step['text']

            console.log(`Создание шага`)
            await createStep(stepNumber, imageStep, textStep)
        }
    }
}



//Create Header
async function createHeader(title, featuredImage) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 800
    })
    await page.goto('https://www.npmjs.com/package/ejs');
    await page.screenshot({ path: `test.png` }); // делаем скриншот 
    await browser.close();                          // закрываем браузер

    console.log(`хидер готов `)
}

//Create Step
async function createStep(step, imageStep, textStep) {
    const browser = await puppeteer.launch({ headless: false, slowMo: 100, devtools: true })
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 800
    })
    await page.goto('https://www.npmjs.com/package/ejs');
    await page.screenshot({ path: `test.png` }); // делаем скриншот 
    await browser.close();                          // закрываем браузер

    console.log(`шаг готов`)
}



server.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})