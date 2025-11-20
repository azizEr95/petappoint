import express, {urlencoded} from 'express';
import { configureCORS } from './configCors';
import { veterinaryPracticeRouter } from './routes/veterinaryPractice';
import { appointmentRouter } from './routes/appointments';
import { personsRouter } from './routes/persons';
import { animalsRouter } from './routes/animals';
import { animaltypeRouter } from './routes/animaltypes';

export const app = express();

configureCORS(app);
// app.use(cookieParser()); // TODO

app.use(express.json());
app.use("/api/veterinary-practice", veterinaryPracticeRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/persons", personsRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/animaltypes", animaltypeRouter);