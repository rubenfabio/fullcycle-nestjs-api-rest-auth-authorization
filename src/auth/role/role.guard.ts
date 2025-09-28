import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const handlerRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    const controllerRoles = this.reflector.get<Role[]>(
      'roles',
      context.getClass(),
    );

    const requiredRoles = controllerRoles;
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (!authUser || !authUser.role) {
      return false;
    }

    if (authUser.role === Role.ADMIN) {
      return true;
    }
    return requiredRoles.includes(authUser.role);
  }
}
