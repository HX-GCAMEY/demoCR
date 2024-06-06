import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderDetails } from '../entities/orderDetails.entity';
import { Orders } from '../entities/orders.entity';
import { Products } from '../entities/products.entity';
import { Users } from '../entities/users.entity';


@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async addOrder(userId: string, products: any) {
    let total = 0;

    // ? Verficar que exista el usuario
    const user = await this.usersRepository.findOneBy({ id: userId });
    
    if (!user) throw new NotFoundException(`Usuario con id ${userId} no encontrado`) 
    
    
// ? Creamos la orden:
    const order = new Orders();
    order.date = new Date();
    order.user = user;
    
    // ? Guardar la orden en la DB
    const newOrder = await this.ordersRepository.save(order);

    // ? Asociar cada id que recibimos con el producto
    const productsArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.productsRepository.findOneBy({
          id: element.id,
        });
        
        if (!product) throw new NotFoundException(`Producto con id ${element.id} no encontrado`) 
    
        // ? Calculamos el monto total:
        total += Number(product.price); 
        
        // ? Actualizando el stock
        await this.productsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );

        return product;
      }),
    );

    // ? crear el detalle de la orden y guardarla en la DB:
    const orderDetail = new OrderDetails();

    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;

    await this.orderDetailRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetails: true,
      },
    });
  }

  getOrder(id: string) {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order)  throw new NotFoundException(`Orden con id ${id} no encontrada`) ;

    return order;
  }
}