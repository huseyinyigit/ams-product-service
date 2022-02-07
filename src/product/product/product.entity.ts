import {Entity, Column, OneToOne, JoinColumn} from 'typeorm';
import {BaseSystemEntity} from "../../system/base/base-system.entity";
import {Length} from "class-validator";
import {Category} from "../category/category.entity";

@Entity({ name: 'product' })
export class Product extends BaseSystemEntity {

    @Column({ type: 'varchar', length: 100 })
    @Length(2, 100)
    name: string;

    @Column({ type: 'varchar', length: 100 })
    @Length(5, 100)
    barcode: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    description: string;

    @OneToOne(() => Category, { nullable: false })
    @JoinColumn()
    category: Category;
}
