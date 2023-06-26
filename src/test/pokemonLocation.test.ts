import request from "supertest";
import { app } from "../app";

test("return Pokemon location data as JSON", (done) => {
  request(app)
    .get("/api/pokemonLocation")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toHaveProperty("version1", {
        Gloom: {
          maximumX: 451,
          maximumY: 832,
          minimumX: 340,
          minimumY: 732,
        },
        Mudkip: {
          maximumX: 2000,
          maximumY: 497,
          minimumX: 1907,
          minimumY: 407,
        },
        Politoed: {
          maximumX: 2347,
          maximumY: 1413,
          minimumX: 2243,
          minimumY: 1304,
        },
      });
      expect(res.body).toHaveProperty("version2", {
        Graveler: {
          maximumX: 1018,
          maximumY: 631,
          minimumX: 947,
          minimumY: 570,
        },
        Pichu: {
          maximumX: 419,
          maximumY: 521,
          minimumX: 374,
          minimumY: 466,
        },
        Slaking: {
          maximumX: 1044,
          maximumY: 234,
          minimumX: 961,
          minimumY: 162,
        },
      });
      expect(res.body).toHaveProperty("version3", {
        Charizard: {
          maximumX: 586,
          maximumY: 417,
          minimumX: 501,
          minimumY: 331,
        },
        Pikachu: {
          maximumX: 564,
          maximumY: 762,
          minimumX: 497,
          minimumY: 684,
        },
        Snorlax: {
          maximumX: 1070,
          maximumY: 692,
          minimumX: 985,
          minimumY: 604,
        },
      });
    })
    .end(done);
});
