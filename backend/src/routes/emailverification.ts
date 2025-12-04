import express from 'express'
import { verifyJWT } from '../service/jwtService';

/*
* This Router is for emailverification only post emailverification is done in persons Router
*/
export const emailverificationRouter = express.Router();

emailverificationRouter.get("/:jwtToken", 
    async (req, res) => {
        try {
            const jwt = req.params.jwtToken;
            const userData = verifyJWT(jwt);
            res.cookie('access_token', jwt, {
            httpOnly: true,
            expires: new Date(userData.exp * 1000),
            secure: true,
            sameSite: "none"
        });
            res.send(userData);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)