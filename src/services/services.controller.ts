import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
        const userId = req.user.id;
        return this.servicesService.create(createServiceDto, userId);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.id;
        return this.servicesService.findAll(userId);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateServiceDto: UpdateServiceDto,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.servicesService.update(id, updateServiceDto, userId);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        const userId = req.user.id;
        return this.servicesService.remove(id, userId);
    }
}