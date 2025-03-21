import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

const connectionString = process.env.DB_CONNECTION ?? '';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(connectionString),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
