import fs from 'fs'
import puppeteer from 'puppeteer'

let link = 'https://www.russianfood.com/recipes/recipe.php?rid=139175&ref=cro_i_2&token=1201879990'

const ParseReciepts = async click => {
    try {
        const browser = await puppeteer.launch({ headless: true, slowMo: 100, devtools: true })
        let page = await browser.newPage()
        await page.setViewport({
            width: 1400,
            height: 900
        })
        await page.goto(link, { waitUntil: 'domcontentloaded' })
        await page.waitForSelector('table.recipe_new')

        let html = await page.evaluate(async () => {
            let res = []

            //ОБЛОЖКА
            let titleRecipe = await document.querySelector('.recipe_new .title').innerText
            let featuredImage = await document.querySelector('.recipe_new .main_image a').href
            let products = await document.querySelectorAll('#from > tbody > tr > td > table > tbody > tr > td')
            let productList = {}

            for (let i = 0; i < products.length; i++) {
                const element = products[i].innerText;
                productList[i] = element;
            }

            res.push({
                header: {
                    'title': titleRecipe,
                    'image': featuredImage,
                    'products': productList,
                },
            })


            //ШАГИ
            let stepCount = 1
            let stepContainer = await document.querySelectorAll('.step_n')

            stepContainer.forEach(item => {
                let step = stepCount++
                let text = item.querySelector('p').innerText
                let img
                try {
                    img = item.querySelector('a').href
                } catch (e) {
                    img = null
                }

                res.push({
                    [step]: {
                        'text': text,
                        'image': img
                    },
                })
            })

            return res
        })

        fs.writeFile('riciepts.json', JSON.stringify(html), function (err) {
            if (err) throw err
            console.log('Парсинг выполнен!')
        })
        
        //console.log(html)
        await browser.close()

    } catch (e) {
        console.log(e)
    }
}

ParseReciepts(0)