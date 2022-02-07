import {Injectable} from '@nestjs/common';
import {BaseService} from "../../system/base/base.service";
import {Category} from "./category.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategoryDTO} from "./category.dto";

@Injectable()
export class CategoryService extends BaseService<Category> {

    constructor(
        @InjectRepository(Category)
        protected repo: Repository<Category>
    ) {
        super(repo, Category, CategoryDTO);
    }
}
