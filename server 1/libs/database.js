import mongoose from "mongoose";

export default function connect() {
  mongoose.connection.on("connected", () => console.log("Datenbank verbunden"));
  mongoose.connection.on("error", (error) =>
    console.log("Datenbank nicht verbunden :(", error)
  );

  // Verbindung zu MongoDB erstellen:
  const url = process.env.MONGODB_CONNECTION_STRING; // DO NOT COMMIT SECRETS
  return mongoose.connect(url);
}
