import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
	private client: S3;

	constructor() {
		this.client = new aws.S3({
			region: 'us-east-1',
		});
	}

	public async saveFile(file: string): Promise<string> {
		const originalPath = path.resolve(uploadConfig.tmpFolder, file);

		const ContentType = mime.getType(originalPath);

		if (!ContentType) {
			throw new Error('File not found');
		}

		const fileContent = fs.promises.readFile(originalPath);

		await this.client
			.putObject({
				Bucket: uploadConfig.config.aws.bucket, // Nome do bucket no CDN,
				Key: file,
				ACL: 'public-read', // Permissões
				Body: fileContent,
				ContentType,
			})
			.promise();

		await fs.promises.unlink(originalPath);

		return file;
	}

	public async deleteFile(file: string): Promise<void> {
		await this.client
			.deleteObject({
				Bucket: 'app-gobarber',
				Key: file,
			})
			.promise();
	}
}

export default DiskStorageProvider;
