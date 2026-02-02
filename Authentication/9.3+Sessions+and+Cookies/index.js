import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.set("view engine", "ejs");

// ---------------- SESSION SETUP ----------------
// express-session creates a session object on the server
// and sends a session ID cookie to the browser.
// This is what lets the server "remember" users.
app.use(
  session({
    secret: "TOPSECRETWORD", // signs cookie so it can't be tampered with
    resave: false, // don't save session if nothing changed
    saveUninitialized: true, // create session even if empty
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // session expires after 1 day
    },
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ---------------- PASSPORT INITIALIZATION ----------------
// initialize() → activates passport
// session() → connects passport with express-session
app.use(passport.initialize());
app.use(passport.session());

// ---------------- DATABASE CONNECTION ----------------
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456789",
  port: 5432,
});
db.connect();

// ---------------- ROUTES ----------------

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Protected route – only accessible if logged in
app.get("/secrets", (req, res) => {
  console.log(req.user); // user object attached by passport.deserializeUser

  if (req.isAuthenticated()) {
    // true if session valid and user exists
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

// ---------------- REGISTER ----------------
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check if user already exists
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // Hash password before storing in DB
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash],
          );

          const user = result.rows[0];

          // req.login() manually logs the user in
          // triggers passport.serializeUser and creates session
          req.login(user, (err) => {
            if (err) {
              console.log(err);
              return res.redirect("/login");
            }
            // After session is created, redirect to protected page
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// ---------------- LOGIN ----------------
// passport.authenticate triggers the local strategy
// and automatically logs user in on success
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  }),
);

// ---------------- LOCAL STRATEGY ----------------
// Defines how username & password are verified
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;

        // Compare entered password with hashed password in DB
        bcrypt.compare(password, storedHashedPassword, (err, match) => {
          if (err) return cb(err);

          if (match) {
            return cb(null, user); // SUCCESS → triggers serializeUser
          } else {
            return cb(null, false); // FAILURE
          }
        });
      } else {
        return cb(null, false);
      }
    } catch (err) {
      return cb(err);
    }
  }),
);

// ---------------- SERIALIZE USER ----------------
// Runs ONLY at login time
// Stores user identity into session
passport.serializeUser((user, cb) => {
  cb(null, user.id); // best practice: store only ID
});

// ---------------- DESERIALIZE USER ----------------
// Runs on every request with valid session
// Converts stored ID → full user object → attaches to req.user
passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

// ---------------- SERVER START ----------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
