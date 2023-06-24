import request from "supertest";
import express from "express";
import pokemonLocation from "../routes/pokemonLocation";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api/pokemonLocation", pokemonLocation);

test("return Pokemon location data as JSON", (done) => {
  request(app)
    .get("/api/pokemonLocation")
    .expect("Content-Type", /json/)
    .expect(200, done());
});
