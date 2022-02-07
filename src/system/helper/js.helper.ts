import {Observable, OperatorFunction} from "rxjs";
import {debounceTime, map, tap} from "rxjs/operators";

export class Obj {
    static isDefined = (value: any, nullable?: boolean): boolean => {
        return (nullable === true || value !== null) && value !== undefined && value !== "undefined";
    }

    static is = (obj): boolean => {
        return (typeof obj === "object" && !Array.isArray(obj) && obj !== null);
    }

    static has = (obj: any, property: string): boolean => {
        let o = obj;
        const props = property.split(".");
        if (props.length > 1) {
            for (let i = 0; i < props.length - 1; i++) {
                const prop = props[i];
                o = obj[prop];

                if (!Obj.is(o)) {
                    return false;
                }
            }
        }

        return Obj.is(o) && o.hasOwnProperty(property);
    }

    static isFnc = (obj: any, fncName?: string): boolean => {
        return fncName ? obj[fncName] instanceof Function : obj instanceof Function;
    }

    static get = (obj: any, fieldName: string, defaultResult?: any) => {
        if (!Obj.is(obj)) {
            return null;
        }

        let res = obj;
        fieldName.split(".").forEach((key) => {
            if (res) { res = res[key]; }
        });

        return res || obj[fieldName] || defaultResult;
    }

    static value = (obj: any, field: string, value?: any): any => {
        if (!obj) {
            return null;
        }

        let o = {};
        let ox = obj;
        const keys = field.split(".");
        const setter = Obj.isDefined(value, true);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            if (setter) {
                o[k] = i < keys.length - 1 ? {} : value;
                ox = o;
                o = o[k];
            } else {
                if (Obj.has(ox, k)) {
                    ox = ox[k];
                } else {
                    return null;
                }
            }
        }

        if (setter) {
            return { ...obj, ...ox };
        } else {
            return ox;
        }
    }
}

export class Str {
    static is = (value): boolean => {
        return typeof value === "string" || value instanceof String;
    }
}

export class Arr {
    static is = (arr): boolean => {
        return Array.isArray(arr);
    }

    static len = (arr) => {
        if (!Arr.is(arr)) {
            return 0;
        }

        return arr.length;
    }

    static get = (arr, ind: number) => {
        return Arr.is(arr) ? (ind > -1 && ind < arr.length ? arr[ind] : null) : null;
    }

    static groupBy = (arr: any[], field: string) => {
        return arr.reduce((r, a) => {
            r[a[field]] = r[a[field]] || [];
            r[a[field]].push(a);
            return r;
        }, Object.create(null));
    }
}

export class Num {
    static is = (num: any) => {
        return !Number.isNaN(num);
    }

    static isInt = (num: any) => {
        return Number.isInteger(num);
    }

    static random = (max: number = Number.MAX_SAFE_INTEGER, min: number = 0): number => {
        return Math.random() * (max - min) + min;
    }

    static randomInt = (max: number = Number.MAX_SAFE_INTEGER, min: number = 0): number => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}

export class RxJS {
    static bufferDebounceTime<T>(time: number = 0): OperatorFunction<T, T[]> {
        return (source: Observable<T>) => {
            let bufferedValues: T[] = [];

            return source.pipe(
                tap(value => bufferedValues.push(value)),
                debounceTime(time),
                map(() => bufferedValues),
                tap(() => bufferedValues = []),
            );
        };
    }
}

export interface ClassType<T> {
    new(): T;
}
