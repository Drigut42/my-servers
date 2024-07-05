// Middleware prüft JWT, Authorisierung der Anfragen

// Import benötigt, auch wenn Funktion exportiert wird
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_KEY;

export default function checkToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    console.log(req.headers);
    console.log(authHeader);

    if (!authHeader) {
      // HTTP 401, User/Client hat sich nicht erfolgreich authorisiert
      return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    console.log(token);
    jwt.verify(token, jwtKey, async (err, user) => {
      if (err) {
        // HTTP 403, authorisiert, aber Zugriff verboten
        return res.sendStatus(403);
      }
      // Such den User in der DB
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
}
