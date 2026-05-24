import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TrafficService } from '../src/traffic/traffic.service';
import { Country } from '../src/traffic/entities/country.entity';
import { TrafficRecord } from '../src/traffic/entities/traffic-record.entity';

describe('TrafficService', () => {
  let service: TrafficService;
  let mockCountryRepo: any;
  let mockTrafficRepo: any;

  beforeEach(async () => {
    mockCountryRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockTrafficRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        { provide: getRepositoryToken(Country), useValue: mockCountryRepo },
        { provide: getRepositoryToken(TrafficRecord), useValue: mockTrafficRepo },
      ],
    }).compile();

    service = module.get<TrafficService>(TrafficService);
  });

  describe('getByCountry', () => {
    it('should return aggregated country data', async () => {
      const mockQb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { country: 'United States', code: 'US', totalCount: '45200' },
          { country: 'Canada', code: 'CA', totalCount: '31800' },
        ]),
      };
      mockTrafficRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.getByCountry();

      expect(result).toHaveLength(2);
      expect(result[0].country).toBe('United States');
      expect(result[0].totalCount).toBe(45200);
    });
  });

  describe('getByVehicleType', () => {
    it('should return aggregated vehicle type data', async () => {
      const mockQb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { vehicleType: 'car', totalCount: '128400' },
          { vehicleType: 'truck', totalCount: '43200' },
        ]),
      };
      mockTrafficRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.getByVehicleType();

      expect(result).toHaveLength(2);
      expect(result[0].vehicleType).toBe('car');
      expect(result[0].totalCount).toBe(128400);
    });
  });

  describe('create', () => {
    it('should create a traffic record when country exists', async () => {
      const country = { id: 1, name: 'USA', code: 'US' };
      mockCountryRepo.findOneBy.mockResolvedValue(country);

      const dto = { countryId: 1, vehicleType: 'car', count: 5000 };
      const created = { id: 1, ...dto, recordedAt: new Date() };
      mockTrafficRepo.create.mockReturnValue(created);
      mockTrafficRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result.count).toBe(5000);
      expect(mockTrafficRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when country does not exist', async () => {
      mockCountryRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({ countryId: 999, vehicleType: 'car', count: 100 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException for non-existent record', async () => {
      mockTrafficRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, { count: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update an existing record', async () => {
      const existing = { id: 1, countryId: 1, vehicleType: 'car', count: 5000 };
      mockTrafficRepo.findOneBy.mockResolvedValue(existing);
      mockTrafficRepo.save.mockResolvedValue({ ...existing, count: 6000 });

      const result = await service.update(1, { count: 6000 });
      expect(result.count).toBe(6000);
    });
  });

  describe('remove', () => {
    it('should remove an existing record', async () => {
      const existing = { id: 1, countryId: 1, vehicleType: 'car', count: 5000 };
      mockTrafficRepo.findOneBy.mockResolvedValue(existing);
      mockTrafficRepo.remove.mockResolvedValue(existing);

      await service.remove(1);
      expect(mockTrafficRepo.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      mockTrafficRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCountries', () => {
    it('should return countries ordered by name', async () => {
      const countries = [
        { id: 1, name: 'Australia', code: 'AU' },
        { id: 2, name: 'Brazil', code: 'BR' },
      ];
      mockCountryRepo.find.mockResolvedValue(countries);

      const result = await service.getCountries();
      expect(result).toEqual(countries);
      expect(mockCountryRepo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });
  });
});
