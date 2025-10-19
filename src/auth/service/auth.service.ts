import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    // --- INÍCIO DA CORREÇÃO ---
    async register(createUserDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Use a variável aqui

        const user = await this.prisma.user.create({
            data: {
                ...createUserDto, // E aqui
                password: hashedPassword,
            },
        });

        if (createUserDto.role === 'PROVIDER') {
            await this.prisma.providerProfile.create({
                data: {
                    userId: user.id,
                },
            });
        }

        const { password, ...result } = user;
        return result;
    }
    // --- FIM DA CORREÇÃO ---
}