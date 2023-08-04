// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const { role } = request.user;
//     const allowedRoles = this.reflector.get<string[]>(
//       'roles',
//       context.getHandler(),
//     );

//     function hasAccess(allowedRoles: string[], userRoles: string[]) {
//       return userRoles.some((role) => allowedRoles.includes(role));
//     }

//     const accessGranted = hasAccess(allowedRoles, role);
//     return accessGranted;
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { role } = request.user;

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    function hasAccess(allowedRoles: string[], userRoles: string[]) {
      // Check if any of the userRoles is present in the allowedRoles array
      return userRoles.some((role) => allowedRoles.includes(role));
    }

    const accessGranted = hasAccess(allowedRoles, role);

    return accessGranted;
  }
}
