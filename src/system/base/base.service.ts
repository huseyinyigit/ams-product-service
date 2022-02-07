import {Repository} from "typeorm";
import {PaginateConfig} from "nestjs-paginate";
import {ClassType} from "../helper/js.helper";
import {Inject} from "@nestjs/common";
import {PaginationQuery, PaginationResult} from "../helper/pagination.service";
import {DBService} from "../helper/db.service";

export abstract class BaseService<E> {

    @Inject() private ds: DBService;

    protected paginateConfig: PaginateConfig<E>;

    protected constructor(
        protected repo: Repository<E>,
        private entityClassType: ClassType<E>,
        private dtoClasses?: { [key: string]: ClassType<any> } | ClassType<any>
    ) {
    }

    async findAll(pq: PaginationQuery): Promise<PaginationResult<any>> {
        return this.ds.find(pq, this.repo, this.entityClassType, this.dtoClasses);
    }

    /*async findAll(query: PaginateQuery): Promise<Paginated<any>> {
        const result = await paginate(query, this.repo, this.paginateConfig);
        this.dtoClassType = this.dtoClassType || this.entityClassType;
        if (this.entityClassType.name !== this.dtoClassType.name)
            result.data = plainToInstance(this.dtoClassType, result?.data);

        return result;
    }*/

    save(data: any): Promise<any> {
        data.createdBy = "hus";
        console.log(data);

        return this.repo.save(data);
    }
}

