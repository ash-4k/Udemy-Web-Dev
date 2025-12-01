// var generateName = require('sillyname');

import generateName from 'sillyname'
var sillyName = generateName();

console.log(`My name is ${sillyName}`)

import {randomSuperhero} from 'superheroes';
const superHeroName = randomSuperhero();

console.log(`And I am ${superHeroName}`)