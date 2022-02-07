import {Injectable} from '@nestjs/common';
import {BaseService} from "../../system/base/base.service";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {PaginateConfig} from "nestjs-paginate";
import {ProductDTO} from "./product.dto";
import {CategoryDTO} from "../category/category.dto";

@Injectable()
export class ProductService extends BaseService<Product> {

    constructor(
        @InjectRepository(Product)
        protected repo: Repository<Product>
    ) {
        super(repo, Product, { $: ProductDTO, category: CategoryDTO });

        this.paginateConfig = {
            sortableColumns: ['name'],
            searchableColumns: ['name', 'barcode']
        } as PaginateConfig<Product>;
    }
}
