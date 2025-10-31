import express, {urlencoded} from 'express';
import { configureCORS } from './configCors';
import { veterinaryPracticeRouter } from './routes/veterinaryPractice';

export const app = express();

configureCORS(app);
// app.use(cookieParser()); // TODO

app.use(express.json());
app.use("/api/veterinary-practice", veterinaryPracticeRouter);