import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { Player } from '../players/interfaces/player.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categories') private readonly categoryModel: Model<Category>,
    @InjectModel('Players') private readonly playerModel: Model<Player>,
  ) {}
  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(category: Category): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(category);
      return await newCategory.save();
    } catch (error) {
      this.logger.error(`error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel.findByIdAndUpdate(id, category);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find();
    } catch (error) {
      this.logger.error(`error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      return await this.categoryModel.findById(id);
    } catch (error) {
      this.logger.error(`error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }
}
