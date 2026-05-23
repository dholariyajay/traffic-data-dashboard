import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../traffic/entities/country.entity';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
    @InjectRepository(TrafficRecord)
    private trafficRepo: Repository<TrafficRecord>,
  ) {}

  async onModuleInit() {
    const count = await this.countryRepo.count();
    if (count > 0) return;

    await this.seed();
  }

  private async seed() {
    const countries = await this.countryRepo.save([
      { name: 'United States', code: 'US' },
      { name: 'Canada', code: 'CA' },
      { name: 'Germany', code: 'DE' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'India', code: 'IN' },
      { name: 'Brazil', code: 'BR' },
      { name: 'Japan', code: 'JP' },
      { name: 'Australia', code: 'AU' },
    ]);

    const distributions: Record<string, Record<string, number>> = {
      'United States': { car: 45200, truck: 12300, motorcycle: 5400, bus: 3200, bicycle: 2100 },
      'Canada': { car: 31800, truck: 8900, motorcycle: 3600, bus: 2800, bicycle: 4200 },
      'Germany': { car: 38500, truck: 9100, motorcycle: 4800, bus: 4100, bicycle: 8900 },
      'United Kingdom': { car: 34200, truck: 7600, motorcycle: 3900, bus: 5200, bicycle: 6100 },
      'India': { car: 22400, truck: 15800, motorcycle: 28900, bus: 8700, bicycle: 3400 },
      'Brazil': { car: 29100, truck: 11200, motorcycle: 14500, bus: 6300, bicycle: 1800 },
      'Japan': { car: 41300, truck: 8400, motorcycle: 6200, bus: 3800, bicycle: 9500 },
      'Australia': { car: 33700, truck: 10500, motorcycle: 4100, bus: 2900, bicycle: 5300 },
    };

    const records: Partial<TrafficRecord>[] = [];

    for (const country of countries) {
      const dist = distributions[country.name];
      if (!dist) continue;

      for (const [vehicleType, count] of Object.entries(dist)) {
        records.push({
          countryId: country.id,
          vehicleType,
          count,
          recordedAt: new Date(),
        });
      }
    }

    await this.trafficRepo.save(records);
    this.logger.log(`Seeded ${records.length} traffic records across ${countries.length} countries`);
  }
}
