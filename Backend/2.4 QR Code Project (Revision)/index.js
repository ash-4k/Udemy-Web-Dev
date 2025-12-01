/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from 'inquirer';

const userInput = await inquirer
  .prompt([
    {
        type : "input",
        name : "userInput",
        message : "Enter URL to create QR: "
    }
  ])
  .then((answers) => {
    return answers.userInput;
  });

// import {input} from '@inquirer/prompts'
// const userInput = await input({message : "What's your name "});

// console.log(`Name : ${userInput}`)

// var qr = require('qr-image');
import qr from 'qr-image'
import fs from 'node:fs';

var qr_img = qr.image(userInput, {type: 'png'});
qr_img.pipe(fs.createWriteStream('qr_imgNew.png'))

fs.writeFile('./newText.txt', userInput, (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
})


