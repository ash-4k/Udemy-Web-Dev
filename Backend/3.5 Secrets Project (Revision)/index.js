//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from 'express'
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser'

const app = express()
const port = 3001
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended:true}))

// var userIsAuthorised = false;

function pwdCheck(req, res) { 
    if (req.body.password === 'Ashu')
        return true
    // next();
 }

// app.use(pwdCheck)


app.get("/", (req, res) => {
    // userIsAuthorised = false
    res.sendFile(__dirname + `/public/index.html`)
})

app.post("/check", (req, res)=>{
    console.log(req.body.password)
    if (pwdCheck(req, res)) {
        res.sendFile(__dirname + `/public/secret.html`)
    }   else {
        res.redirect("/");
    }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});