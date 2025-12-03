import express from 'express'
import { verifyJWT } from '../service/jwtService';

/*
* This Router is for emailverification only post emailverification is done in persons Router
*/
export const emailverificationRouter = express.Router();

emailverificationRouter.get("/:jwtToken", 
    async (req, res) => {
        try {
            const userData = verifyJWT(req.params.jwtToken);
            res.send(userData);
        } catch (error) {
            res.sendStatus(500);
        }
    }
)