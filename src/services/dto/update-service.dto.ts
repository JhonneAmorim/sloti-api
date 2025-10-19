import {
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsPositive()
    @Min(0.01)
    @IsOptional()
    price?: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    @IsOptional()
    duration?: number;
}