import express from "express";
import { getPokemonLocationData } from "../controllers/pokemonLocationController";

const router = express.Router();

// GET validation data.
router.get("/", getPokemonLocationData);

export default router;
