import {IsString, IsUUID} from 'class-validator';
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class CategoryDTO {
    @Expose()
    @IsUUID()
    readonly id: number;

    @Expose()
    @IsString()
    readonly name: string;
}
