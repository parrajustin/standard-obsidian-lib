/**
 * File utils that are specific to raw files.
 */

import { normalizePath, FileSystemAdapter, type App, type DataWriteOptions } from "obsidian";
import type { Result, StatusResult } from "standard-ts-lib/src/result";
import { Ok } from "standard-ts-lib/src/result";
import { ErrorCode, type StatusError } from "standard-ts-lib/src/status_error";
import { WrapPromise } from "standard-ts-lib/src/wrap_promise";
import { InjectMeta } from "standard-ts-lib/src/status_util/inject_status_msg";
import { PromiseResultSpanError } from "../decorators/result_span.decorator";

export class FileUtilRaw {
    /** Reads a file through the raw apis. */
    @PromiseResultSpanError
    public static async readRawFile(
        app: App,
        filePath: string
    ): Promise<Result<Uint8Array, StatusError>> {
        const readDataResult = await WrapPromise(
            app.vault.adapter.readBinary(normalizePath(filePath)),
            /*textForUnknown=*/ `Failed to fs read from "${filePath}"`
        );
        if (readDataResult.err) {
            readDataResult.val.with(
                InjectMeta({
                    ["filePath"]: filePath
                })
            );
            return readDataResult;
        }
        return Ok(new Uint8Array(readDataResult.safeUnwrap()));
    }

    /** Write the `data` to the raw file at `filePath`. */
    @PromiseResultSpanError
    public static async writeToRawFile(
        app: App,
        filePath: string,
        data: Uint8Array,
        opts?: DataWriteOptions
    ): Promise<StatusResult<StatusError>> {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const arryBufferData: ArrayBuffer = data.buffer.slice(
            data.byteOffset,
            data.byteLength + data.byteOffset
        ) as ArrayBuffer;
        const pathSplit = filePath.split("/");
        // Remove the final filename.
        pathSplit.pop();
        const mkdirs = await WrapPromise(
            app.vault.adapter.mkdir(normalizePath(pathSplit.join("/"))),
            /*textForUnknown=*/ `Failed to mkdir "${filePath}"`
        );
        if (mkdirs.err) {
            mkdirs.val.with(InjectMeta({ ["filePath"]: filePath }));
            return mkdirs;
        }

        const writeResult = await WrapPromise(
            app.vault.adapter.writeBinary(normalizePath(filePath), arryBufferData, opts),
            /*textForUnknown=*/ `Failed to write fs file "${filePath}"`
        );
        if (writeResult.err) {
            writeResult.val.with(InjectMeta({ ["filePath"]: filePath }));
            return writeResult;
        }
        return Ok();
    }

    /** Deletes the raw file at `filePath`, works for any file. */
    @PromiseResultSpanError
    public static async deleteRawFile(
        app: App,
        filePath: string
    ): Promise<StatusResult<StatusError>> {
        const trashSystemResult = await WrapPromise(
            app.vault.adapter.trashSystem(normalizePath(filePath)),
            /*textForUnknown=*/ `Failed to trash system "${filePath}"`
        );
        if (trashSystemResult.err) {
            trashSystemResult.val.with(InjectMeta({ ["filePath"]: filePath }));
            return trashSystemResult;
        }
        if (trashSystemResult.safeUnwrap()) {
            return Ok();
        }
        const trashLocalResult = await WrapPromise(
            (app.vault.adapter as FileSystemAdapter).trashLocal((app.vault.adapter as FileSystemAdapter).getFullPath(filePath)),
            /*textForUnknown=*/ `Failed to trash local "${filePath}"`
        );
        if (trashLocalResult.err) {
            trashLocalResult.val.with(InjectMeta({ ["filePath"]: filePath }));
            return trashLocalResult;
        }
        return Ok();
    }
}
