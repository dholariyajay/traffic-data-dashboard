import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';

@Controller('api/traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('by-country')
  async getByCountry() {
    const data = await this.trafficService.getByCountry();
    return { data };
  }

  @Get('by-vehicle-type')
  async getByVehicleType() {
    const data = await this.trafficService.getByVehicleType();
    return { data };
  }

  @Get()
  async findAll() {
    const records = await this.trafficService.findAll();
    return { data: records };
  }

  @Post()
  async create(@Body() dto: CreateTrafficDto) {
    const record = await this.trafficService.create(dto);
    return { data: record };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrafficDto,
  ) {
    const record = await this.trafficService.update(id, dto);
    return { data: record };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.trafficService.remove(id);
    return { success: true };
  }
}

@Controller('api/countries')
export class CountryController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async findAll() {
    const data = await this.trafficService.getCountries();
    return { data };
  }
}

@Controller('api')
export class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
