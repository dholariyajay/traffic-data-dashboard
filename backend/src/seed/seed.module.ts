import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Country } from '../traffic/entities/country.entity';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, TrafficRecord])],
  providers: [SeedService],
})
export class SeedModule {}
