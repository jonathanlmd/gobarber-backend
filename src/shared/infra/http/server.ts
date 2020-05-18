import 'reflect-metadata';
import 'dotenv/config';
import express, { json, Response, Request, NextFunction } from 'express';
import 'express-async-errors';
import '@shared/infra/typeorm/index';
import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';
import routes from './routes/index';
import '@shared/container/index';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(rateLimiter);

app.use(cors());

app.use(json());

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
	if (err instanceof AppError) {
		return response.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	console.error(err);

	return response.status(500).json({
		static: 'error',
		message: 'internal server error.',
	});
});

app.listen(3333, () => {
	console.log('Server started on port 3333!');
});
