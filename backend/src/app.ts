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
<<<<<<< HEAD
<<<<<<< HEAD
import { routerExceptionHandler } from './exceptions/routerExceptionMiddleware';
=======
import { emailverificationRouter } from './routes/emailverification';
>>>>>>> 28b79f1 (email service and router done needs to be tested though)
=======
import { emailverificationRouter } from './routes/emailverification';
>>>>>>> daa4e66b7b1f66d5978f35b5f380eda1f48f5352

export const app = express();

configureCORS(app);

app.use(cookieParser());
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/veterinary-practice", veterinaryPracticeRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/persons", personsRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/animaltypes", animaltypeRouter);
app.use("/api/services", serviceRouter);
<<<<<<< HEAD
<<<<<<< HEAD
app.use(routerExceptionHandler);
=======
app.use("api/email-confirmation", emailverificationRouter);
>>>>>>> 28b79f1 (email service and router done needs to be tested though)
=======
app.use("api/email-confirmation", emailverificationRouter);
>>>>>>> daa4e66b7b1f66d5978f35b5f380eda1f48f5352
