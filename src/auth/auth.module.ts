import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    global:true,
    signOptions: { expiresIn: '2h',algorithm: 'HS256'},
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
