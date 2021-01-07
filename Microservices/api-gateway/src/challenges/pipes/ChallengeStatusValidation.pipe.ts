import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
    private isValidStatus(status: any) {
        const index = this.acceptStatus.indexOf(status);

        return index !== -1;
    }

    readonly acceptStatus = [
        ChallengeStatus.ACEITO,
        ChallengeStatus.NEGADO,
        ChallengeStatus.CANCELADO,
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.isValidStatus(status)) {
            throw new BadRequestException(`${status} é um status inválido`);
        }

        return value;
    }
}
