import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { TrafficRecord } from './entities/traffic-record.entity';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
    @InjectRepository(TrafficRecord)
    private trafficRepo: Repository<TrafficRecord>,
  ) {}

  // TODO: add date range filter once we have enough historical data
  async getByCountry() {
    const results = await this.trafficRepo
      .createQueryBuilder('tr')
      .select('c.name', 'country')
      .addSelect('c.code', 'code')
      .addSelect('SUM(tr.count)', 'totalCount')
      .innerJoin('tr.country', 'c')
      .groupBy('c.name')
      .addGroupBy('c.code')
      .orderBy('SUM(tr.count)', 'DESC')
      .getRawMany();

    return results.map((r) => ({
      country: r.country,
      code: r.code,
      totalCount: parseInt(r.totalCount),
    }));
  }

  // TODO: consider caching aggregated queries if read volume grows
  async getByVehicleType() {
    const results = await this.trafficRepo
      .createQueryBuilder('tr')
      .select('tr.vehicleType', 'vehicleType')
      .addSelect('SUM(tr.count)', 'totalCount')
      .groupBy('tr.vehicleType')
      .orderBy('SUM(tr.count)', 'DESC')
      .getRawMany();

    return results.map((r) => ({
      vehicleType: r.vehicleType,
      totalCount: parseInt(r.totalCount),
    }));
  }

  async findAll() {
    return this.trafficRepo.find({
      relations: ['country'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateTrafficDto) {
    const country = await this.countryRepo.findOneBy({ id: dto.countryId });
    if (!country) {
      throw new NotFoundException(`Country with id ${dto.countryId} not found`);
    }

    const record = this.trafficRepo.create({
      countryId: dto.countryId,
      vehicleType: dto.vehicleType,
      count: dto.count,
      recordedAt: new Date(),
    });

    return this.trafficRepo.save(record);
  }

  async update(id: number, dto: UpdateTrafficDto) {
    const record = await this.trafficRepo.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Traffic record #${id} not found`);
    }

    if (dto.countryId !== undefined) {
      const country = await this.countryRepo.findOneBy({ id: dto.countryId });
      if (!country) throw new NotFoundException(`Country with id ${dto.countryId} not found`);
    }

    Object.assign(record, dto);
    return this.trafficRepo.save(record);
  }

  async remove(id: number) {
    const record = await this.trafficRepo.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Traffic record #${id} not found`);
    }
    await this.trafficRepo.remove(record);
  }

  async getCountries() {
    return this.countryRepo.find({ order: { name: 'ASC' } });
  }
}
