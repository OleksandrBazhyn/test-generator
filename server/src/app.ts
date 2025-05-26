import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import logger from './logger';
import morgan from 'morgan';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(morgan('combined', { stream }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
    logger.info('Server started on port %d', PORT);
});

export default app;
