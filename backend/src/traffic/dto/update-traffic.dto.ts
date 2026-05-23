import { IsNumber, IsString, IsIn, Min, IsOptional } from 'class-validator';

export class UpdateTrafficDto {
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['car', 'truck', 'motorcycle', 'bus', 'bicycle'])
  vehicleType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  count?: number;
}
