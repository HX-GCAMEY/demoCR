import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/products.module';
import { UsersModule } from './user/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CategoriesModule } from './categories/categories.module';
// import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Hacemos disponible a "typeorm" a Todo el Módulo:
    // "typeorm" puede ser invocado porque es instancia de DataSource
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    // Configuramos el Módulo "typeorm"
    TypeOrmModule.forRootAsync({
      // Inyectamos "ConfigService" y sus Módulos de 
      //Configuración:
      inject: [ConfigService],
      // Ahora utilizamos el Módulo "typeorm":
      useFactory: (config: ConfigService) => 
							      config.get('typeorm'),
    }),
    ProductModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    AuthModule,
    JwtModule.register({
      global:true,
      secret:process.env.JWT_SECRET,
      signOptions:{
        expiresIn:'1h'
      }
    })
    // CategoriesModule,
    // OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
