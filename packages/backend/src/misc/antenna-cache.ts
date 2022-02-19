import { Antennas } from '@/models/index';
import { Antenna } from '@/models/entities/antenna';
import { redisSubscriber } from '../db/redis';

let antennasFetched = false;
let antennas: Antenna[] = [];

export async function getAntennas() {
	if (!antennasFetched) {
		antennas = await Antennas.find();
		antennasFetched = true;
	}

	return antennas;
}

redisSubscriber.subscribe('internal', async (message) => {
	const { type, body } = JSON.parse(message);
	switch (type) {
		case 'antennaCreated':
			antennas.push(body);
			break;
		case 'antennaUpdated':
			antennas[antennas.findIndex(a => a.id === body.id)] = body;
			break;
		case 'antennaDeleted':
			antennas = antennas.filter(a => a.id !== body.id);
			break;
		default:
			break;
	}
});
