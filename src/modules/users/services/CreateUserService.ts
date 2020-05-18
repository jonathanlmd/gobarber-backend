import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
export default class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
		@inject('CacheProvider')
		private cacheProvider: ICacheProvider
	) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		const checkUsersExist = await this.usersRepository.findByEmail(email);

		if (checkUsersExist) {
			throw new AppError('Email address already used');
		}

		const hashedpassword = await this.hashProvider.generateHash(password);

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashedpassword,
		});

		await this.cacheProvider.invalidade('providers-list:*');
		return user;
	}
}
