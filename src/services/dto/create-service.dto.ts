import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    @Min(0.01)
    price: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    duration: number;
}