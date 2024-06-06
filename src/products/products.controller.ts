import {
  // Body,
  Controller,
  Delete,
  Get,
  Param,
  // Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query('page') page: string, @Query('limit') limit: string) {
    return this.productsService.getProducts(Number(page), Number(limit));
  }

  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {}

  // @Post()
  // addProduct(@Body() product: any) {}

  @Put(':id')
  @UseGuards(AuthGuard)
  updateProduct(@Param('id') id: string) {}

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {}
}
