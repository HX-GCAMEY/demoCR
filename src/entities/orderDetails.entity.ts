import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Products } from './products.entity';
  import { Orders } from './orders.entity';
  
  @Entity({
    name: 'orderdetails',
  })
  export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'decimal',
      precision: 10, 
      scale: 2, 
    })
    price: number; 
  
    @OneToOne(() => Orders, (order) => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: Orders;
  
      //
    @ManyToMany(() => Products)
    @JoinTable({
      name: 'orderdetails_products',
      joinColumn: {
        name: 'product_id',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {
        name: 'orderdetail_id',
        referencedColumnName: 'id'
      }
    })
    products: Products[];
  }