import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeCacheProvider = new FakeCacheProvider();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
			fakeCacheProvider
		);
	});

	it('should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'joao',
			email: 'joao@gmail.com',
			password: '123123',
		});

		expect(user).toHaveProperty('id');
	});
	it('should not be able to create a new user with same email from another', async () => {
		await createUser.execute({
			name: 'joao',
			email: 'joao@gmail.com',
			password: '123123',
		});

		await expect(
			createUser.execute({
				name: 'joao2',
				email: 'joao@gmail.com',
				password: '123123',
			})
		).rejects.toBeInstanceOf(AppError);
	});
});
