import express from 'express'
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser'

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended:true}))

let typeDay = 'week-day';
let message = 'work hard'

function weekDayClassifier (req, res, next) { 
    if([0,6].includes((new Date()).getDay())){
        typeDay = 'week-end';
        message = 'have fun'
    }
    next()
}

app.use(weekDayClassifier)


app.get("/", (req, res) => {
    res.render(`index.ejs`, {
        typeDay : typeDay,
        message : message
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});