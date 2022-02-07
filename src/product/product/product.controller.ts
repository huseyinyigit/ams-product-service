import {Controller} from '@nestjs/common';
import {BaseController} from "../../system/base/base.controller";
import {ProductService} from "./product.service";
import {Product} from "./product.entity";

@Controller('product')
export class ProductController extends BaseController<Product> {
    constructor(
        protected service: ProductService
    ) {
        super(service);
    }
}
