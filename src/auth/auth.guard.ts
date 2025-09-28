import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import type { Request } from 'express';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = this.jwtService.verify<{
        name: string;
        email: string;
        role: Role;
        sub: string;
        permissions: string[];
      }>(token, { algorithms: ['HS256'] });
      const user: User | null = await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      console.log(user);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = user;
      this.abilityService.createForUser(user);
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token', {
        cause: error,
      });
    }
  }
}
