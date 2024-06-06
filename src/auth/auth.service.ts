import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { UserRepository } from 'src/user/users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}
  getAuth(): string {
    return 'get auth';
  }


  async signUp(user:Partial<Users>){
    const { email, password } = user

    // ? Verificar si el email está registrado...
    const foundedUser = await this.userRepository.getUserByEmail(email)

    if(foundedUser) throw new BadRequestException('Registered Email')

    // ? Proceso de registro

    // * Hasheando la password
    const hashedPassword = await bcrypt.hash(password, 10)

    // * guardar en DB
    return await this.userRepository.createUser({ ...user, password: hashedPassword})

  }


  async signIn(email: string, password: string) {
    if (!email || !password) return 'email y password required';

    // ? Verificamos que el usuario exista
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) return 'Invalid Credentials';

    //? comparar contraseñas...
    const validPassword = await bcrypt.compare(password, user.password)
    
    if(!validPassword) throw new BadRequestException('Invalid Credentials')

    // ? Firma del token..
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    }

    // * Generación del token
    const token = this.jwtService.sign(payload)

    // ? Entregamos la respuesta
    return {
      message: 'Logged-in User',
      token
    }
  }
}