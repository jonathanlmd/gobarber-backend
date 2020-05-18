import { Response, Request } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UsersController {
	async create(request: Request, response: Response): Promise<Response> {
		const { name, email, password } = request.body;
		const createUser = container.resolve(CreateUserService);
		const user = await createUser.execute({
			name,
			email,
			password,
		});

		return response.json(classToClass(user));
	}

	async avatarUpdate(request: Request, response: Response): Promise<Response> {
		const updateUserAvatar = container.resolve(UpdateUserAvatarService);
		const user = await updateUserAvatar.execute({
			user_id: request.user.id,
			avatarFilename: request.file.filename,
		});
		return response.json(classToClass(user));
	}
}
