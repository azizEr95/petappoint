import http from "http";
import https from "https"
import { app } from "./app";
import path from "path";

import * as dotenv from "dotenv";

declare global {
    var appRootDir: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      CORS_ORIGIN: string;
      HTTP_PORT: string;
      BREVO_API_KEY: string;
      JWT_SECRET: string;
      JWT_TTL: string;
    }
  }
}

global.appRootDir = path.resolve(path.join(__dirname, '..'));

function readEnv() {
    const result = dotenv.config({override: true});
    if (result.error) {
        console.log("No .env file found.");
    }
    if (!process.env.JWT_TTL) {
        throw new Error("Missing environment variable JWT_TTL.");
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing environment variable JWT_SECRET.");
    }

    if (!process.env.HTTP_PORT) {
        console.log("No HTTP_PORT set in environment, using default: 3000");
        process.env.HTTP_PORT = "3000";
    }
}

async function start() {
    readEnv();

    // http server starten lassen bei npm start
    const port = parseInt(process.env.HTTP_PORT);
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.info(`Listening to HTTP at http://localhost:${port}`)
    })
    return;

    //TODO -- SSL verschluesselung für https server 
}


start();