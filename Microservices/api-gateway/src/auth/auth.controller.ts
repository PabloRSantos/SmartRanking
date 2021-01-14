import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRecordUserDto } from './dtos/auth-record-user.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private awsCognitoService: AwsCognitoService) {}

    @Post('/signUp')
    @UsePipes(ValidationPipe)
    async signUp(@Body() authRecordUserDto: AuthRecordUserDto) {
        return await this.awsCognitoService.signUpUser(authRecordUserDto);
    }

    @Post('/signIn')
    @UsePipes(ValidationPipe)
    async signIn(@Body() authLoginUserDto: AuthLoginUserDto) {
        return await this.awsCognitoService.signInUser(authLoginUserDto);
    }
}
