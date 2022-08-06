const router = require("express").Router();
const user = require("../models/user");
const card = require("../models/card");
const {
  getAllusers,
  getUserById,
  createUser,
} = require("../controllers/users");

const { getAllCards, createCard, deleteCard } = require("../controllers/cards");

router.get("/users", getAllusers);

router.get("/users/:userid", getUserById);

router.post("/users/", createUser);

router.get("/cards", getAllCards);

router.post("/cards", createCard);

router.delete("cards", deleteCard);
