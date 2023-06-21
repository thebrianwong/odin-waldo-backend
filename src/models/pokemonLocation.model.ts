import { Schema, model } from "mongoose";

const gameVersions = ["version1", "version2", "version3"];

const PokemonLocationSchema = new Schema({
  gameVersion: { type: String, enum: gameVersions },
  data: {
    type: Map,
    of: {
      type: Map,
      of: Number,
    },
  },
});

const PokemonLocation = model("pokemon-location", PokemonLocationSchema);

export default PokemonLocation;
