// istanbul ignore file

import express from 'express';
import cors, { CorsOptions } from 'cors';

export function configureCORS(app: express.Express) {
    const corsArr = extractCors()
    corsArr.forEach(element => {
        console.log(element)
    });
    if (corsArr.length === 0) {
        console.warn("WARNING: CORS_ORIGIN not set, allowing no origins");
    } else {
        var corsOptions: CorsOptions = {
            origin: corsArr,
            methods: "GET,PUT,POST,DELETE",
            allowedHeaders: "Origin,Content-Type",
            optionsSuccessStatus: 200,
            credentials: true
        }

        app.use(cors(corsOptions));
    }
}

function extractCors(): string[] {
    return [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_APP].filter(value => value !== undefined)
}
