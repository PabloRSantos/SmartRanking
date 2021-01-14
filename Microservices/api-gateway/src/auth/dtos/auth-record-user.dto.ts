import { IsString, IsEmail, Matches, IsMobilePhone } from 'class-validator';

export class AuthRecordUserDto {
    @IsString()
    name: string;

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

    @IsMobilePhone('pt-BR')
    mobilePhone: string;
}
