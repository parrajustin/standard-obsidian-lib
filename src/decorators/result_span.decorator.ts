/* eslint-disable @typescript-eslint/no-explicit-any */
import { Err, type Result } from "standard-ts-lib/src/result";
import type { StatusError } from "standard-ts-lib/src/status_error";
import { UnknownError } from "standard-ts-lib/src/status_error";
import { SetSpanStatusFromResult } from "./set-span-status";

type ResultFunc = (...args: any) => Result<any, StatusError>;
type PromiseResultFunc = (...args: any) => Promise<Result<any, StatusError>>;

export function ResultSpanError(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ResultFunc>
) {
    const originalMethod = descriptor.value;

    let spanName = String(propertyKey);
    const className = String(target.constructor.name);
    if (className !== "") {
        spanName = className + "::" + spanName;
    }
    if (originalMethod === undefined) {
        throw Err(UnknownError(`ResultSpan decorator applied to undefined method "${spanName}".`));
    }
    descriptor.value = function (...args: any): Result<any, StatusError> {
        const result = originalMethod.apply(this, args) as Result<any, StatusError>;
        SetSpanStatusFromResult(result);
        return result;
    };

    return descriptor;
}

export function PromiseResultSpanError(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<PromiseResultFunc>
) {
    const originalMethod = descriptor.value;

    let spanName = String(propertyKey);
    const className = String(target.constructor.name);
    if (className !== "") {
        spanName = className + "::" + spanName;
    }
    if (originalMethod === undefined) {
        throw Err(UnknownError(`ResultSpan decorator applied to undefined method "${spanName}".`));
    }

    descriptor.value = function (...args: any): Promise<Result<any, StatusError>> {
        const result = originalMethod.apply(this, args) as Promise<Result<any, StatusError>>;
        return result.then<Result<any, StatusError>>((value) => {
            SetSpanStatusFromResult(value);
            return value;
        });
    };

    return descriptor;
}
