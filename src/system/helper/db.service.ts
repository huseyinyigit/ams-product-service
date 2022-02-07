import {camelCase} from "lodash";
import {Repository, SelectQueryBuilder} from "typeorm";
import {ClassType, Num} from "./js.helper";
import {Inject, Injectable} from "@nestjs/common";
import {Filter, PaginationQuery, PaginationResult, PaginationService, Sort} from "./pagination.service";
import {instanceToInstance} from "class-transformer";

@Injectable()
export class DBService {

    @Inject()
    private ps: PaginationService;

    find = async (
        pq: PaginationQuery,
        repo: Repository<any>,
        entityClassType: ClassType<any>,
        dtoClasses?: { [key: string]: ClassType<any> } | ClassType<any>
    ): Promise<PaginationResult<any>> => {
        const conditions = [];
        pq.filters?.forEach((filter) => {
            const condition = this.filter2Condition(filter);
            condition ? conditions.push(condition) : null;
        });

        const qb = this.selectQueryBuilder(repo, entityClassType, dtoClasses, conditions, pq.sorts);

        const limit = this.ps.limit(pq.limit);
        const pageNum = ((Num.isInt(pq.page) && pq.page >= 0) ? pq.page : 0);
        qb.limit(limit);
        qb.offset(limit * pageNum);

        const [list, count] = await qb.getManyAndCount();
        return {
            data: list,
            count,
            page: pq.page,
            limit: pq.limit
        };
    }

    selectQueryBuilder = (
        repo: Repository<any>,
        entityClassType: ClassType<any>,
        dtoClasses?: { [key: string]: ClassType<any> } | ClassType<any>,
        conditions?: SQLCondition[],
        sorts?: Sort[]
    ): SelectQueryBuilder<any> => {
        const dtoClass = dtoClasses?.["$"] || dtoClasses || entityClassType;
        const alias = entityClassType.name;

        const qb = repo.createQueryBuilder(alias);

        let columns = Object.keys(instanceToInstance(new dtoClass()));
        if (columns?.length > 0) {
            const joinColumns = [];
            const rems = [];
            if (dtoClasses?.["$"]) {    //if join dto is exist
                columns?.forEach((col, index) => {
                    const joinClass = dtoClasses[col];
                    if (joinClass) {
                        rems.push(col);

                        const joinAlias = col + index;
                        qb.leftJoinAndSelect(alias + "." + col, joinAlias);
                        let jcols = Object.keys(instanceToInstance(new joinClass()));
                        jcols = jcols.map(jcol => joinAlias + "." + jcol);
                        joinColumns.push(...jcols);
                    }
                });
            }

            console.log(columns);
            qb.select(
                columns
                .filter(col => !rems.includes(col))
                .map(col => alias + "." + col)
                .concat(...joinColumns)
            );
        }

        conditions?.forEach((condition, index) => {
            index === 0 ?
                qb.where(condition.expression, condition.parameter) :
                qb.andWhere(condition.expression, condition.parameter)
            ;
        });

        sorts?.forEach(sort => {
            qb.addOrderBy(sort.field, sort.direction || "ASC");
        });
        
        return qb;
    }

    filter2Condition = (filter: Filter, entityClassType?: ClassType<any>): SQLCondition => {
        // for now only max two level
        const fieldName = filter.field.split(".")[0];
        if (entityClassType && !entityClassType.hasOwnProperty(fieldName))
            return;

        let p = filter.value;
        let ex: string;

        const colName = filter.field;
        const parName = camelCase(colName);
        switch (filter.matchMode) {
            case "startsWith":
                ex = "like";
                p = `${filter.value}%`;
                break;
            case "endsWith":
                ex = "like";
                p = `%${filter.value}`;
                break;
            case "contains":
                ex = "like";
                p = `%${filter.value}%`;
                break;
            case "notEquals":
                ex = "<>";
                break;
            case "equals":
                ex = "=";
                break;
            case "gt":
                ex = ">";
                break;
            case "gte":
                ex = ">=";
                break;
            case "lt":
                ex = "<";
                break;
            case "lte":
                ex = "<=";
                break;
            case "is":
                ex = "is null";
                p = undefined;
                break;
            case "isNot":
                ex = "is not null";
                p = undefined;
                break;
            case "in":
                ex = "in(:" + parName + ")";
                break;
        }

        if (!ex.includes(":"))
            ex = colName + " " + ex + " :" + parName;
        else
            ex = colName + " " + ex;

        const parameter = {};
        parameter[parName] = p;

        return {
            expression: ex,
            parameter
        }
    }
}

export interface SQLCondition {
    expression: string;
    parameter: { [key: string]: any };
}
