import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "AshleshKanchan";
const yourPassword = "IAmTheBest";
const yourAPIKey = "e4185b51-b93f-4e54-805e-2777fa62ad3f";
const yourBearerToken = "30a2b0db-34ef-466e-a83a-14bab30d44e7";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  const response = await axios.get("https://secrets-api.appbrewery.com/random");
  const result = JSON.stringify(response.data, null, 2);
  console.log("[NoAuth] secrets-api.appbrewery.com/random :");
  console.log(result);
  res.render("index.ejs", { content: result });
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  const response = await axios.get(
    "https://secrets-api.appbrewery.com/all?page=2",
    {
      auth: { 
        username: yourUsername, 
        password: yourPassword 
      },
    }
  );
  const result = JSON.stringify(response.data, null, 2);
  console.log("[basicAuth] secrets-api.appbrewery.com/all?page=2 :");
  console.log(result);
  res.render("index.ejs", { content: result });
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {
  const response = await axios.get(
    // `https://secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey}`
    `https://secrets-api.appbrewery.com/filter`,
    {
      params: {
        score : 5,
        apiKey : yourAPIKey
      }
    }
  );
  const result = JSON.stringify(response.data, null, 2);
  console.log("[apiKey] secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey} :");
  console.log(result);
  res.render("index.ejs", { content: result });
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  const response = await axios.get(
    "https://secrets-api.appbrewery.com/secrets/42",
    {
      headers: { 
        Authorization: `Bearer ${yourBearerToken}`
      },
    }
  );
  const result = JSON.stringify(response.data, null, 2);
  console.log("[bearerToken] secrets-api.appbrewery.com/secrets/42 :");
  console.log(result);
  res.render("index.ejs", { content: result });
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
