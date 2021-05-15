import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { routes } from './routes';
import 'reflect-metadata';
import { AppError } from './errors/AppError';
import createConnection from './database/connection';

createConnection();
const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`,
  });
});

app.listen(3333, () => {
  console.log('Server has started on port 3333');
});
