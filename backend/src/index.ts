import http from "http";
import https from "https"
import { app } from "./app";
import path from "path";

declare global {
    var appRootDir: string;
};

global.appRootDir = path.resolve(path.join(__dirname, '..'));

async function start() {
    // http server starten lassen bei npm start
    const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000;
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.info(`Listening to HTTP at http://localhost:${port}`)
    })
    return;

    //TODO -- SSL verschluesselung für https server 
}


start();