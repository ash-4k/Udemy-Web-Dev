import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

let letters = 0;

function countLetters (req, res, next) { 
  letters = req.body.fName.length + req.body.lName.length
  next();
}

// app.use(countLetters)

app.get("/", (req, res) => {
  res.render("index.ejs", {letters : letters})
});

app.post("/submit", countLetters, (req, res) => {
  console.log(letters)
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
