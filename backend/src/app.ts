import express from 'express';
import { configureCORS } from './configCors';
import cookieParser from 'cookie-parser';
import { veterinaryPracticeRouter } from './routes/veterinaryPractice';
import { appointmentRouter } from './routes/appointments';
import { personsRouter } from './routes/persons';
import { animalsRouter } from './routes/animals';
import { animaltypeRouter } from './routes/animaltypes';
import { serviceRouter } from './routes/services';
import { loginRouter } from './routes/login';
import { routerExceptionHandler } from './exceptions/routerExceptionMiddleware';
import { emailverificationRouter } from './routes/emailverification';
import { veterinariansRouter } from './routes/veterinary';

export const app = express();

configureCORS(app);

app.use(cookieParser());
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/veterinarians", veterinariansRouter);
app.use("/api/veterinary-practice", veterinaryPracticeRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/persons", personsRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/animaltypes", animaltypeRouter);
app.use("/api/services", serviceRouter);
app.use("/api/registration", emailverificationRouter);
app.use(routerExceptionHandler);
