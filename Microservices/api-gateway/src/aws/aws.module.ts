import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsService } from './aws.service';

@Module({
    providers: [AwsService, AwsCognitoService],
    exports: [AwsService, AwsCognitoService],
})
export class AwsModule {}
