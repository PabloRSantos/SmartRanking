import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/proxyrmq.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Controller('api/v1/categories')
export class CategoryController {
    private logger = new Logger(CategoryController.name);

    constructor(
        private readonly clientProxySmartRanking: ClientProxySmartRanking,
    ) {}

    private readonly clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminInstance();

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UsePipes(ValidationPipe)
    createCategory(@Body() createCategoryDto: CreateCategoryDto): void {
        this.clientAdminBackend.emit('create-category', createCategoryDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getCategories(@Query('id') id: string): Observable<any> {
        return this.clientAdminBackend.send('get-categories', id ? id : '');
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @UsePipes(ValidationPipe)
    updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('id') id: string,
    ): void {
        this.clientAdminBackend.emit('update-category', {
            id,
            category: updateCategoryDto,
        });
    }
}
