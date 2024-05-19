import { RequestHandler } from "express";
import PokemonLocation from "../models/pokemonLocation.model";
import {
  DatabasePokemonLocationData,
  APIPokemonLocationData,
} from "../types/pokemonLocationData.type";

const getPokemonLocationData: RequestHandler = async (req, res, next) => {
  try {
    const pokemonLocationData: APIPokemonLocationData = {
      version1: {},
      version2: {},
      version3: {},
    };
    const rawPokemonData: Array<DatabasePokemonLocationData> =
      await PokemonLocation.find({}, { _id: 0, __v: 0 }).lean();
    rawPokemonData.forEach((pokemonData) => {
      pokemonLocationData[pokemonData.gameVersion] = pokemonData.data;
    });
    res.send(pokemonLocationData);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: `Error retrieving Pokemon location data: ${err}` });
  }
};

export { getPokemonLocationData };
