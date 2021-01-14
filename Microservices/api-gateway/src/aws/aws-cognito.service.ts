import { Injectable } from '@nestjs/common';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    ICognitoUserData,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from 'src/auth/dtos/auth-login-user.dto';
import { AuthRecordUserDto } from 'src/auth/dtos/auth-record-user.dto';

@Injectable()
export class AwsCognitoService {
    private userPool: CognitoUserPool;

    constructor() {
        this.userPool = new CognitoUserPool({
            UserPoolId: process.env.userPoolId,
            ClientId: process.env.clientId,
        });
    }

    async signUpUser(authRecordUserDto: AuthRecordUserDto) {
        const { name, email, password, mobilePhone } = authRecordUserDto;

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                password,
                [
                    new CognitoUserAttribute({
                        Name: 'phone_number',
                        Value: mobilePhone,
                    }),
                    new CognitoUserAttribute({
                        Name: 'name',
                        Value: name,
                    }),
                ],
                null,
                (err, result) => {
                    if (!result) {
                        reject(err);
                    } else {
                        resolve(result.user);
                    }
                },
            );
        });
    }

    async signInUser(authLoginUserDto: AuthLoginUserDto) {
        const { email, password } = authLoginUserDto;

        const userData: ICognitoUserData = {
            Username: email,
            Pool: this.userPool,
        };

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const userCognito = new CognitoUser(userData);

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    resolve(result);
                },
                onFailure: (err) => reject(err),
            });
        });
    }
}
