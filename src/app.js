import express from "express";
import cors from "cors";
import GraphQLServer from "./GraphQLServer";

const app = express();

const graphQLServer = new GraphQLServer().getApolloServer();
// console.log('graphQLServer==>',graphQLServer)
graphQLServer.applyMiddleware({ app });

const { MONGO_URL, PORT } = process.env;
const APP_PORT = PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", async (_, res) => {
  res.send("Hello Web!");
});

app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${APP_PORT}`);
});
