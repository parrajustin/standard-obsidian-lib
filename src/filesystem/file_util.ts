import type { App, DataWriteOptions } from "obsidian";
import type { Result, StatusResult } from "standard-ts-lib/src/result";
import type { StatusError } from "standard-ts-lib/src/status_error";
import { FileUtilObsidian } from "./file_util_obsidian_api";
import { FileUtilRaw } from "./file_util_raw_api";
import { PromiseResultSpanError } from "../decorators/result_span.decorator";

export enum FileSystemType {
    OBSIDIAN = "OBSIDIAN",
    RAW = "RAW"
}

export class FileUtil {
    @PromiseResultSpanError
    public static async fetchFile(
        app: App,
        filePath: string,
        type: FileSystemType = FileSystemType.OBSIDIAN
    ): Promise<Result<Uint8Array, StatusError>> {
        if (type === FileSystemType.OBSIDIAN) {
            return FileUtilObsidian.readObsidianFile(app, filePath);
        } else {
            return FileUtilRaw.readRawFile(app, filePath);
        }
    }

    @PromiseResultSpanError
    public static async writeToFile(
        app: App,
        filePath: string,
        data: Uint8Array,
        type: FileSystemType = FileSystemType.OBSIDIAN,
        opts?: DataWriteOptions
    ): Promise<StatusResult<StatusError>> {
        if (type === FileSystemType.OBSIDIAN) {
            return FileUtilObsidian.writeToObsidianFile(app, filePath, data, opts);
        } else {
            return FileUtilRaw.writeToRawFile(app, filePath, data, opts);
        }
    }

    @PromiseResultSpanError
    public static async deleteFile(
        app: App,
        filePath: string,
        type: FileSystemType = FileSystemType.OBSIDIAN
    ): Promise<StatusResult<StatusError>> {
        if (type === FileSystemType.OBSIDIAN) {
            return FileUtilObsidian.deleteObsidianFile(app, filePath);
        } else {
            return FileUtilRaw.deleteRawFile(app, filePath);
        }
    }
}
