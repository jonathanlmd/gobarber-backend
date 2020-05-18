import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider
		);
	});
	it('should be able to authenticate', async () => {
		const user = await fakeUsersRepository.create({
			name: 'joao',
			email: 'joao@gmail.com',
			password: '123123',
		});

		const response = await authenticateUser.execute({
			email: 'joao@gmail.com',
			password: '123123',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should not be able to authenticate with non existent user', async () => {
		await expect(
			authenticateUser.execute({
				email: 'joao@gmail.com',
				password: '123123',
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong passworod', async () => {
		await fakeUsersRepository.create({
			name: 'joao',
			email: 'joao@gmail.com',
			password: '123123',
		});

		await expect(
			authenticateUser.execute({
				email: 'joao@gmail.com',
				password: '123',
			})
		).rejects.toBeInstanceOf(AppError);
	});
});
