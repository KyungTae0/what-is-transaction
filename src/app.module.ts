import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from 'src/common/config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamTest1Entity } from 'src/entities/sam-test1.entity';
import { SamTest2Entity } from 'src/entities/sam-test2.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서나 config module 접근 가능하게 함(global)
      load: [config],
      //dev면 .env.dev파일 사용, stag면 .env.stag파일 사용, prod면 .env.prod사용
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forFeature([SamTest1Entity, SamTest2Entity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [SamTest1Entity, SamTest2Entity],
      synchronize: true,
      logging: false,
      extra: {
        waitForConnections: true,
        connectTimeout: 10000,
        queueLimit: 3000,
        connectionLimit: 10,
      },
      replication: {
        master: {
          host: process.env.BRING_DB_RW_HOST,
          port: 3306,
          username: process.env.BRING_DB_USERNAME,
          password: process.env.BRING_DB_PASSWORD,
          database: process.env.BRING_DB_DATABASE,
        },
        slaves: [
          {
            host: process.env.BRING_DB_RO_HOST,
            port: 3306,
            username: process.env.BRING_DB_USERNAME,
            password: process.env.BRING_DB_PASSWORD,
            database: process.env.BRING_DB_DATABASE,
          },
        ],
      },

      // logging: process.env.NODE_ENV === 'dev',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
