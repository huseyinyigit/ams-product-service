import { Entity, Column } from 'typeorm';
import {BaseSystemEntity} from "../../system/base/base-system.entity";
import {Length} from "class-validator";

@Entity({ name: 'category' })
export class Category extends BaseSystemEntity {

    @Column({ type: 'varchar', length: 100 })
    @Length(2, 100)
    name: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    description: string;
}
