import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/user/roles.enum';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    // 'Bearer xxxxxx'
    // ['Bearer', 'xxxxx']
    const token = request.headers.authorization?.split(' ')[1]

    if(!token) throw new UnauthorizedException('Token required')

    try {
      // ? Validar el token...
      const secret = process.env.JWT_SECRET
      const payload = this.jwtService.verify(token, { secret })

      // console.log(payload);
      
      payload.exp = new Date(payload.exp * 1000)
      payload.iat = new Date(payload.iat * 1000)
      payload.roles = payload.isAdmin ? [Role.Admin] : [Role.User]

      request.user = payload
      
      return true

    } catch (error) {
      throw new UnauthorizedException('Invalid Token') 
    }
  }
}
