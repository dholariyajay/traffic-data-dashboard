import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { TrafficModule } from './traffic/traffic.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TrafficModule,
    SeedModule,
  ],
})
export class AppModule {}
