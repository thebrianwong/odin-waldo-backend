import request from "supertest";
import { app } from "../app";
import Leaderboard from "../models/leaderboard.model";

afterEach(async () => {
  await Leaderboard.deleteMany({});
});

test("return leaderboard entries data as JSON", (done) => {
  request(app)
    .get("/api/leaderboard")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toHaveProperty("version1");
      expect(res.body).toHaveProperty("version2");
      expect(res.body).toHaveProperty("version3");
    })
    .end(done);
});

test("submission succeeds with valid entry details", (done) => {
  request(app)
    .post("/api/leaderboard/new")
    .type("form")
    .send({
      name: "test",
      score: 666,
      favoritePokemon: "test",
      timeStamp: "1987-05-22T04:33:34.697+00:00",
      gameVersion: "version1",
    })
    .then(() => {
      request(app)
        .get("/api/leaderboard")
        .expect(() => {
          expect.objectContaining({
            favoritePokemon: "test",
            name: "test",
            score: 666,
            timeStamp: "1987-05-22T04:33:34.697+00:00",
          });
        })
        .end(done);
    });
});

test("submission succeeds with empty name and favorite Pokemon", (done) => {
  request(app)
    .post("/api/leaderboard/new")
    .type("form")
    .send({
      name: "",
      score: 666,
      favoritePokemon: "",
      timeStamp: "1987-05-22T04:33:34.697+00:00",
      gameVersion: "version1",
    })
    .then(() => {
      request(app)
        .get("/api/leaderboard")
        .expect(() => {
          expect.objectContaining({
            favoritePokemon: "Missingno",
            name: "Anonymous Trainer",
            score: 666,
            timeStamp: "1987-05-22T04:33:34.697+00:00",
          });
        })
        .end(done);
    });
});

test("submission fails with invalid/missing score, time stamp, and game version", (done) => {
  request(app)
    .post("/api/leaderboard/new")
    .type("form")
    .send({
      name: "test",
      score: undefined,
      favoritePokemon: "test",
      timeStamp: "invalid fate string",
      gameVersion: "version100000",
    })
    .expect(400)
    .expect((res) => {
      expect(res.body).toMatchObject({
        success: false,
        message: {
          score: "Your submission must include a score.",
          timeStamp: "Your submission must include a valid date.",
          gameVersion: "Your submission must include a valid game version.",
        },
      });
    })
    .then(() => {
      request(app)
        .get("/api/leaderboard")
        .expect(() => {
          expect.not.objectContaining({
            name: "test",
            score: undefined,
            favoritePokemon: "test",
            timeStamp: "invalid fate string",
          });
        })
        .end(done);
    });
});
