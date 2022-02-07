import {Injectable} from '@nestjs/common';
import {Arr, Num} from "./js.helper";

@Injectable()
export class PaginationService {

    maxRowPerPage = parseInt(process.env.DB_QUERY_MAX_ROW_PER_PAGE || process.env.DB_QUERY_ROW_PER_PAGE || '20');
    defRowPerPage = parseInt(process.env.DB_QUERY_ROW_PER_PAGE || '20');

    parseQuery = (query: any): PaginationQuery => {
        return {
            page: this.page(parseInt(query.page)),
            limit: this.limit(parseInt(query.limit)),
            filters: this.filters(query),
            sorts: this.sorts(query)
        };
    }

    page = (page: number): number => {
        return (Num.is(page) && Num.isInt(page) && page >= 0) ? page : 0;
    }

    limit = (limit: number): number => {
        limit = (Num.is(limit) && Num.isInt(limit) && limit > 0) ? limit: this.defRowPerPage;
        return limit > this.maxRowPerPage ? this.maxRowPerPage : limit;
    }

    // filter.age=gte:3&filter.name=contains:ahmet
    filters = (query: any): Filter[] => {
        if (!query) {
            return null;
        }

        const key = "filter.";
        const filters: Filter[] = [];
        for (const field of Object.keys(query)) {
            if (!field.startsWith(key)) {
                continue;
            }

            const f = field.substring(key.length);

            let value = query[field];
            const ind = value.indexOf(":");
            let matchMode: FilterMatchMode;
            if (ind > 0) {
                value = query[field].substring(ind+1);
                matchMode = query[field].substring(0, ind);
            }

            filters.push({
                field: f,
                value,
                matchMode
            });
        }

        return filters;
    }

    sorts = (query: any): Sort[] => {
        if (!query.sort) {
            return null;
        }

        const sorts: Sort[] = [];
        const ss = query.sort.split(",");
        for (let s of ss) {
            const args = s.split(":");
            const direction: SortDirection = Arr.get(args, 1) || "ASC";
            sorts.push({
                field: args[0],
                direction
            })
        }

        return sorts;
    }
}

export interface PaginationQuery extends Pagination {
    sorts?: Sort[];
    filters?: Filter[];
}

export interface PaginationResult<T> extends Pagination {
    count: number;
    data?: T[];
}

export interface Pagination {
    limit: number;
    page: number;
}

export type FilterMatchMode = "startsWith" | "contains" | "endsWith" | "equals" | "notEquals" | "in" | "lt" | "lte" | "gt" | "gte" | "is" | "isNot" | "before" | "after";
export interface Filter {
    field: string;
    value: any;
    matchMode?: FilterMatchMode;
}

export type SortDirection = "ASC" | "DESC";
export interface Sort {
    field: string;
    direction?: SortDirection;
}
