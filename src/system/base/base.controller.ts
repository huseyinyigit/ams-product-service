import {Body, Get, Inject, Post, Query} from '@nestjs/common';
import {BaseService} from "./base.service";
import {BaseDTO} from "./base-dto.interface";
import {PaginationResult, PaginationService} from "../helper/pagination.service";

export class BaseController<E> {

    @Inject()
    private ps: PaginationService;

    constructor(
        protected service: BaseService<E>
    ) {
    }

    @Post()
    async save(@Body() dto: BaseDTO) {
        return this.service.save(dto);
    }

    @Get()
    public findAll(@Query() query): Promise<PaginationResult<any>> {
        return this.service.findAll(this.ps.parseQuery(query));
    }
}
