// Loads the express module and other dependencies
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");

// Creates our express server
const app = express();
const port = 3006;

// Serves static files (we need it to import a CSS file)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
// set the views folder (in this case, views/pages)
app.set('views', path.join(__dirname, 'src/pages'));

// Parse urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Register a helper for debugging (optional)
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Basic route: if someone accesses /happy via GET, redirect them to home
app.get("/happy", (req, res) => {
  res.redirect("/");
});

// Home route renders index.hbs
app.get("/", (req, res) => {
  res.render("index");
});

// POST route for /happy to process form submissions and generate the song
app.post('/happy', (req, res) => {
  // decompose the input 
  const { name, gender, number } = req.body;
  // converts number of guests to an integer
  const numGuests = parseInt(number);
  
  // create arrays for singers and guests
  let singers = [];
  let guests = [];

  // go through each input based on number of guests
  for (let i = 0; i < numGuests; i++){
  
    const guestName = req.body[`name${i + 1}`];
    // Checking if each checkbox was marked
    const isGoing = req.body[`checkbox${i + 1}`] ? true : false;
    // adds guest info
    guests.push({ guestName, isGoing }); 

    if (isGoing) {
      singers.push(guestName); //adds guest to list of singers if they are going
    }
  }

  //for the last song line; determining whether use he or she based on gender
  let pronoun = "";
  if (gender === "male") {
    pronoun = "he's";
  } else if (gender === "female") {
    pronoun = "she's";
  }

  //song line for the last person
  const songLine = `For, ${pronoun} , a,jolly,good,fellow.,For,${pronoun},a,jolly,good,fellow.,For,${pronoun},a,jolly,good,fellow,,which,nobody,can,deny!`;

 //birthday song for which every person sings back and forth
  const song = [
    { singer: singers[0 % singers.length], word: "Happy" },
    { singer: singers[1 % singers.length], word: "birthday" },
    { singer: singers[2 % singers.length], word: "to" },
    { singer: singers[3 % singers.length], word: "you." },

    { singer: singers[4 % singers.length], word: "Happy" },
    { singer: singers[5 % singers.length], word: "birthday" },
    { singer: singers[6 % singers.length], word: "to" },
    { singer: singers[7 % singers.length], word: "you." },

    { singer: singers[8 % singers.length], word: "Happy" },
    { singer: singers[9 % singers.length], word: "birthday" },
    { singer: singers[10 % singers.length], word: "dear" },
    { singer: singers[11 % singers.length], word: name + "." },

    { singer: singers[12 % singers.length], word: "Happy" },
    { singer: singers[13 % singers.length], word: "birthday" },
    { singer: singers[14 % singers.length], word: "to" },
    { singer: singers[15 % singers.length], word: "you!" },

    { singer: singers[16 % singers.length], word: songLine }
  ];

  
  res.render("happy", { name, gender, number, guests, song, formData: req.body }); //sends rendered HTML string to client
});

// Makes the app listen on port 3006
app.listen(port, () => console.log(`App listening on port ${port}`));

