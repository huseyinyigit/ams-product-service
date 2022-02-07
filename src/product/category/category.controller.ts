import {Controller} from '@nestjs/common';
import {BaseController} from "../../system/base/base.controller";
import {Category} from "./category.entity";
import {CategoryService} from "./category.service";

@Controller('category')
export class CategoryController extends BaseController<Category> {
    constructor(
        protected service: CategoryService
    ) {
        super(service);
    }
}
