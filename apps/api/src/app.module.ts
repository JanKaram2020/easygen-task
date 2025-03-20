import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import {ConfigModule} from "@nestjs/config";

const connectionString = process.env.DB_CONNECTION ?? '';
console.log('MongoDB connectionString',connectionString);

@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot(connectionString),LinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
