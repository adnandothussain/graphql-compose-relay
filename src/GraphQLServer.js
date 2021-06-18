import { ApolloServer } from "apollo-server-express";
// import {getUserFromToken} from 'Utils/auth';
import { ENV_CONFIG } from "./config";
import schema from "./schema/schema";

export default class GraphQLServer {
  constructor() {
    this.appoloServer = new ApolloServer({
      schema,
      playground: {
        endpoint: "/graphql",
      },
      debug: ENV_CONFIG.env === "development",
    });
  }

  getApolloServer() {
    if (this.appoloServer === null) {
      throw new Error("build the server before getting the server");
    }

    return this.appoloServer;
  }
}
