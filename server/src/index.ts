require("dotenv").config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Application } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const port = process.env.PORT;
const secret = process.env.SECRET;

const mount = async (app: Application) => {
  const db = await connectDatabase();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(cookieParser(secret));
  app.use(
    "/api",
    cors(),
    bodyParser.json({ limit: "5mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ db, req, res }),
    })
  );

  await new Promise(async () => {
    httpServer.listen({ port });
    console.log(`[app] : http://localhost:${port}`);
  });
};

mount(express());
