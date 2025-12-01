import express from "express"

const port = 3000;
const app = express();

// let today = new Date();
// let day = today.getDay();


// let week = "weekday";

// function day(req, res, next){
//     if(day === 0 || day === 6)  week = "weekend"
//     next()
// }

// app.use(day);

// app.get("/", (req, res) => {
//     res.render("indexTest.ejs",
//         {day : day}
//         // {week : week}
//     )
// })





app.get("/", (req, res) => {
    // let date = new Date("Aug 9 2025");
    let date = new Date();
    let today = date.getDay();
    console.log(today)
    let type = "a weekday";
    let adv = "it's time to work hard";

    if (today === 0 || today === 6) {
        type = "the weekend";
        adv = "it's time to have fun!";
    }

    res.render("index.ejs", {
        dayType : type,
        advice : adv
    })
})

app.listen(port, () => {
    console.log(`Server running at ${port}`);
})