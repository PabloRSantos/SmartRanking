import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
    private readonly logger = new Logger(AwsService.name);
    async uploadFile(file: any, id: string) {
        const s3 = new S3({
            region: 'us-east-2',
            accessKeyId: process.env.ACESS_KEY_S3,
            secretAccessKey: process.env.SECRET_ACCESS_KEY_S3,
        });

        const fileExtension = file.originalname.split('.')[1];
        const urlKey = `${id}.${fileExtension}`;

        const params = {
            Body: file.buffer,
            Bucket: 'smart-ranking-s3',
            Key: urlKey,
        };

        const data = await s3
            .putObject(params)
            .promise()
            .then(
                () => ({
                    url: `https://smart-ranking-s3.s3-us-east-2.amazonaws.com/${urlKey}`,
                }),
                (err) => {
                    this.logger.error(err);
                    return err;
                },
            );

        return data;
    }
}
