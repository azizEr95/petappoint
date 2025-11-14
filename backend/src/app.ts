import express, {urlencoded} from 'express';
import { configureCORS } from './configCors';
import { veterinaryPracticeRouter } from './routes/veterinaryPractice';
import { appointmentRouter } from './routes/appointments';
import { userRouter } from './routes/persons';

export const app = express();

configureCORS(app);
// app.use(cookieParser()); // TODO

app.use(express.json());
app.use("/api/veterinary-practice", veterinaryPracticeRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/users", userRouter);