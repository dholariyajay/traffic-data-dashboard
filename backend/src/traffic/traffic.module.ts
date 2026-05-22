import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficController, CountryController, HealthController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { Country } from './entities/country.entity';
import { TrafficRecord } from './entities/traffic-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, TrafficRecord])],
  controllers: [TrafficController, CountryController, HealthController],
  providers: [TrafficService],
})
export class TrafficModule {}
