import { IsEmail, Matches } from 'class-validator';

export class AuthLoginUserDto {
    @IsEmail()
    email: string;

    /*
        minimo de 8 caracteres
        uma letra maiuscula
        uma letra minuscula
        um numero

    */
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Senha inválida',
    })
    password: string;
}
