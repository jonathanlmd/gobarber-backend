import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
			fakeAppointmentsRepository
		);
	});

	it('should be able to list the month availability from provider', async () => {
		const hoursInDay = Array.from({ length: 10 }, (_, index) => index + 1);

		Promise.all(
			hoursInDay.map(async hour => {
				await fakeAppointmentsRepository.create({
					date: new Date(2020, 4, 20, hour, 0, 0),
					provider_id: 'user',
					user_id: '11111',
				});
			})
		);

		await fakeAppointmentsRepository.create({
			date: new Date(2020, 3, 29, 8, 0, 0),
			provider_id: 'user',
			user_id: '11111',
		});

		await fakeAppointmentsRepository.create({
			date: new Date(2020, 4, 21, 10, 0, 0),
			provider_id: 'user',
			user_id: '11111',
		});

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'user',
			year: 2020,
			month: 5,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ day: 19, available: true },
				{ day: 20, available: false },
				{ day: 21, available: true },
				{ day: 22, available: true },
			])
		);
	});
});
