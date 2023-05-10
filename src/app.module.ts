import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PokemonModule,
    MongooseModule.forRoot("mongodb://localhost:27017/nest-pokemon"),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname,"..","public")}),        
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
