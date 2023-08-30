import express, {Request, Response} from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import routes from '../routes/v1';

const app = express();
const corsConfig = {origin: "*"};

app.use(express.json());
app.use(cors(corsConfig));
app.use(fileUpload());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.get('/health-check', (req: Request, res: Response) => {
    return res.send('A healthy result.');
});

app.use('/v1', routes);

export default app;