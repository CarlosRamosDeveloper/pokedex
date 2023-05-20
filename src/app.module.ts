import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppConfig } from './config/app.config';
import { CommonModule } from './common/common.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig]
    }),      
    PokemonModule,
    MongooseModule.forRoot(process.env.MONGODB),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname,"..","public")}),
    CommonModule,
    SeedModule,  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
