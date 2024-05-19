# Where's That Pokemon?

In this game, players are provided 3 levels to choose from.

In each level, 3 specific Pokemon must be found among the hundreds of Pokemon in each level's image.

When players think they found a Pokemon, they can click on the image and choose from the list of 3 specific Pokemon.

Upon finding all 3 Pokemon, players are able to submit their time scores, names, and favorite Pokemon to the leaderboard.

Try to get the quickest time in all 3 levels!

---

<s>This repo serves as the source code for the Express backend behind this app.</s>

This API was rewritten to be serverless and run on AWS API Gateway, Lambda, and DynamoDB.
The leaderboard and location work the same way as before.
WebSocket connections are kept track of in DynamoDB.
When a leaderboard entry is added to DynamoDB, a DynamoDB Stream is written and consumed by the broadcast Lambda.
The Lambda queries all the WebSocket connections and sends the updated leaderboard data to the WebSocket clients.

API Gateway is configured to have the same endpoints with the same functionality. API Gateway Models are used to validate the POST request's body for a score and valid game version. This was previously implemented using Express Validation.

The Lambda functions for querying leaderboard and location data and adding a leaderboard entry essentially the same, outside of working with DynamoDB instead of MongoDB. The WebSocket Lambdas are necessary to keep track of WebSocket connections since that used to be the responsibility of the WebSocketServer object instantiated when the Express server was started. The broadcast Lambda is written to delete any WebSocket connection entries that were not deleted by the disconnect WebSocket Lambda.

DynamoDB contains 3 types of rows: leaderboard, location, and WebSocket. MongoDB previously only housed the first two, with the WebSocket type being a new addition due to the API's serverless design. All rows are stored within the same DynamoDB table. A `type` column exists in all rows to filter between them.

The app be found and played [here](https://waldo-frontend.onrender.com/).
