import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "123456789",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// GET home page
app.get("/", async (req, res) => {
  //Write your code here.
  let countries = await checkVisisted();
  res.render("index.ejs", { countries: countries, total: countries.length });
  // db.end();
});

// app.post("/add", async (req, res) => {
//   let country = req.body.country.trim().toLowerCase();
//   console.log(country);
//   let code = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'", [country]);
//   if (code.rowCount) {
//     code = code.rows[0].country_code;
//     console.log(code);
//     db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [code]);
//   }
//   res.redirect("/");
// });
app.post("/add", async (req, res) => {
  let country = req.body.country.trim().toLowerCase();
  console.log(country);
  try {
    let code = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) = LOWER($1) UNION SELECT country_code FROM countries WHERE country_name ILIKE '%' || $1 || '%' LIMIT 1;",
      [country]
    );
    if (code.rowCount === 0) {
      throw new Error("Country not found");
    }
    try {
      code = code.rows[0].country_code;
      console.log(code);
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [code]
      );
      res.redirect("/");
    } catch (err) {
      let countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    let countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
