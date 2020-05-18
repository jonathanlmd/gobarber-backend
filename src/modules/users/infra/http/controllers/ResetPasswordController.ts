import { Response, Request } from 'express';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import { container } from 'tsyringe';

export default class ResetPasswordController {
	async create(request: Request, response: Response): Promise<Response> {
		const { password, token } = request.body;

		const sendForgotPasswordEmail = container.resolve(ResetPasswordService);
		await sendForgotPasswordEmail.execute({
			password,
			token,
		});

		return response.status(204).json();
	}
}
