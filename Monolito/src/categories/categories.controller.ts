import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getCategories(): Promise<Array<Category>> {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.getCategoryById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<void> {
    await this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Post('/:idCategory/player/:idPlayer')
  async addPlayerInCategory(@Param() params: Array<string>): Promise<void> {
    await this.categoriesService.addPlayerInCategory(params);
  }
}
