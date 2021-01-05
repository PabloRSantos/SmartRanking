import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dtos/createChallenge.dto';
import { SetGameInChallengeDto } from './dtos/SetGameInChallenge.dto';
import { UpdateChallengeDto } from './dtos/updateChallenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/ChallengeStatusvalidation.pipe';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query('playerId') playerId: string
  ): Promise<Array<Challenge>> {
    if (playerId) {
      return await this.challengeService.getChallengeOfPlayer(playerId);
    }

    return await this.challengeService.getAllChallenges();
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Param('id') id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto
  ): Promise<void> {
    await this.challengeService.updateChallenge(updateChallengeDto, id);
  }

  @Delete('/:id')
  async deleteChallenge(@Param('id') id: string): Promise<void> {
    await this.challengeService.deleteChallenge(id);
  }

  @Post('/:id/game')
  @UsePipes(ValidationPipe)
  async setGameInChallenge(
    @Param('id') id: string,
    @Body() setGameInChallengeDto: SetGameInChallengeDto
  ): Promise<void> {
    await this.challengeService.setGameInChallenge(setGameInChallengeDto, id);
  }
}
