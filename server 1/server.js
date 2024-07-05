import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connect from "./libs/database.js";
import { User } from "./models/User.js";
import checkToken from "./middleware/tokenCheck.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const port = 3000;

// .env datei lesen (MongoDB Connection, JWT Key)
dotenv.config();
const jwtKey = process.env.JWT_KEY;
// Datenbankverbindung erstellen
await connect();

app.use(express.json()); // Parsen der JSON-Anfragen

app.get("/", (req, res) => {
  res.send("<h1 style='color:red'>Hello World!<h1>");
});

// Registrierungs-Endpoint

app.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Eingabeprüfung: Es muss username und password angegeben werden
    if (!username || !password) {
      return res.status(400).json({
        message: "Please enter username and password. Both are required.",
      });
    }

    // Wenn user schon exsitiert, ablehnen
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This User already exists in the Database!" });
    }

    // Wenn der user nicht exsitiert, einfügen
    // Zuvor Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 13);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User has been registered.", user });
  } catch (error) {
    next(error);
  }
});

// Login-Endpoint

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // Wenn User nicht gefunden wird, ablehnen
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Passwort mit gehashten Passwort vergleichen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // Wenn password falsch eingegeben wurde, ablehnen
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // JSON Web Token erstellen (Payload,jwtKey,Options)
    const token = jwt.sign({ _Id: user._id, username: user.username }, jwtKey, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// Geschützte Route
app.get("/protected", checkToken, (req, res) => {
  res.json({ message: "Well done, you are authorised", user: req.user });
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server läuft auf http://localhost:" + port);
});
