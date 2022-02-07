import {BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export class BaseSystemEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createAt: Date;

    @Column({ type: 'varchar', length: 50 })
    createdBy: string;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    updatedBy: string;
}
