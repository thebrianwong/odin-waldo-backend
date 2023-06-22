import { RequestHandler } from "express";
import PokemonLocation from "../models/pokemonLocation.model";
import PokemonLocationData from "../types/pokemonLocationData.type";

const getPokemonLocationData: RequestHandler = async (req, res, next) => {
  const pokemonLocationData: Array<PokemonLocationData> =
    await PokemonLocation.find({}, { _id: 0, __v: 0 });
  pokemonLocationData.sort((a, b) => {
    if (a.gameVersion < b.gameVersion) {
      return -1;
    } else {
      return 1;
    }
  });
  res.send(pokemonLocationData);
};

export { getPokemonLocationData };
