import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Pega o ID do usuário (do token) e encontra o ID do Perfil de Prestador
     */
    private async getProviderProfileId(userId: string) {
        const profile = await this.prisma.providerProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            throw new UnauthorizedException('Usuário não é um prestador de serviços.');
        }
        return profile.id;
    }

    async create(createServiceDto: CreateServiceDto, userId: string) {
        const providerId = await this.getProviderProfileId(userId);

        return this.prisma.service.create({
            data: {
                ...createServiceDto,
                providerId: providerId,
            },
        });
    }

    async findAll(userId: string) {
        const providerId = await this.getProviderProfileId(userId);

        return this.prisma.service.findMany({
            where: {
                providerId: providerId,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async update(serviceId: string, updateServiceDto: UpdateServiceDto, userId: string) {
        await this.verifyServiceOwnership(serviceId, userId);

        return this.prisma.service.update({
            where: { id: serviceId },
            data: updateServiceDto,
        });
    }

    async remove(serviceId: string, userId: string) {
        await this.verifyServiceOwnership(serviceId, userId);

        return this.prisma.service.delete({
            where: { id: serviceId },
        });
    }

    /**
     * Verifica se o serviço (serviceId) pertence ao usuário (userId)
     */
    private async verifyServiceOwnership(serviceId: string, userId: string) {
        const profileId = await this.getProviderProfileId(userId);

        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service || service.providerId !== profileId) {
            throw new UnauthorizedException('Você não tem permissão para modificar este serviço.');
        }
    }
}