import {IsString, IsUUID} from 'class-validator';
import {Exclude, Expose} from 'class-transformer';
import {CategoryDTO} from "../category/category.dto";

@Exclude()
export class ProductDTO {
    @Expose()
    @IsUUID()
    readonly id: number;

    @Expose()
    @IsString()
    readonly name: string;

    @Expose()
    @IsString()
    readonly barcode: string;

    @Expose()
    readonly category: CategoryDTO;
}
