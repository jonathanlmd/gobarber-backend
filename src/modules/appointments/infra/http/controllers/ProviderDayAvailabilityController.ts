import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';

export default class ProviderDayAvailabilityController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { month, year, day } = request.body;
		const { provider_id } = request.params;

		const listProvidersDayAvailability = container.resolve(
			ListProvidersDayAvailabilityService
		);

		const availability = await listProvidersDayAvailability.execute({
			provider_id,
			month,
			year,
			day,
		});

		return response.json(availability);
	}
}
