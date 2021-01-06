import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        }),
        CategoriesModule,
        PlayersModule,
    ],
})
export class AppModule {}
