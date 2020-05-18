import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		listProviderAppointments = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider
		);
	});

	it('should be able to list the appointments on a specific day from provider', async () => {
		const appointment1 = await fakeAppointmentsRepository.create({
			date: new Date(2020, 4, 20, 14, 0, 0),
			provider_id: 'provider',
			user_id: 'user',
		});
		const appointment2 = await fakeAppointmentsRepository.create({
			date: new Date(2020, 4, 20, 15, 0, 0),
			provider_id: 'provider',
			user_id: 'user',
		});

		const appointments = await listProviderAppointments.execute({
			provider_id: 'provider',
			year: 2020,
			month: 5,
			day: 20,
		});

		expect(appointments).toEqual([appointment1, appointment2]);
	});
});
