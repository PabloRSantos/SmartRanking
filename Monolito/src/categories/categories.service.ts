import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timingSafeEqual } from 'crypto';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categories') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService
  ) {}
  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const categoryExist = await this.categoryModel.findOne({ category }).exec();

    if (categoryExist) {
      throw new BadRequestException(`Categoria ${category} já cadastrada`);
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async getAllCategories(): Promise<Array<Category>> {
    return this.categoryModel.find().populate('players');
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException(`Categoria ${id} não encontrada`);
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<void> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException(`Categoria ${id} não encontrada`);
    }

    await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  async addPlayerInCategory(params: Array<any>): Promise<void> {
    const categoryId = params['idCategory'];
    const playerId = params['idPlayer'];

    const category = await this.categoryModel.findById(categoryId);
    const hasUserInCategory = await this.categoryModel
      .findById(categoryId)
      .where('players')
      .in(playerId);

    await this.playersService.getPlayerById(playerId);

    if (hasUserInCategory) {
      throw new BadRequestException(
        `Jogador ${playerId} já esta cadastrado na categoria ${categoryId}`
      );
    }

    if (!category) {
      throw new NotFoundException(`Categoria ${categoryId} não encontrada`);
    }

    category.players.push(playerId);

    await this.categoryModel.findByIdAndUpdate(categoryId, category);
  }

  async getPlayerCategory(id: string): Promise<Category> {
    return await this.categoryModel.findOne().where('players').in([id]);
  }
}
