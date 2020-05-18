import { container } from 'tsyringe';
import uploadConfig from '@config/upload';
import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvideer from './implementations/DiskStorageProvider';
import S3StoragedProvider from './implementations/S3StoragedProvider';

const providers = {
	disk: DiskStorageProvideer,
	s3: S3StoragedProvider,
};

container.registerSingleton<IStorageProvider>(
	'StorageProvider',
	providers[uploadConfig.driver]
);
