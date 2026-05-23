import { IsNumber, IsString, IsIn, Min } from 'class-validator';

export class CreateTrafficDto {
  @IsNumber()
  countryId: number;

  @IsString()
  @IsIn(['car', 'truck', 'motorcycle', 'bus', 'bicycle'])
  vehicleType: string;

  @IsNumber()
  @Min(0)
  count: number;
}
