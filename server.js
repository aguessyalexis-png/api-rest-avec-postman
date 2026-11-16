require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;

//Middleware obligatoire pour lire le corps des requêtes JSON (POST / PUT)
app.use(express.json());

//connecter la base de données au server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Base de données connectée"))
  .catch((err) => console.error("Erreur de connexion :", err));

// Construction des API REST (get;post;put;delete)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body); //Insérer un nouvel utilisateur
    const savedUser = await newUser.save(); //enrégistrer le nouvel utilisateur
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//lancement du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
