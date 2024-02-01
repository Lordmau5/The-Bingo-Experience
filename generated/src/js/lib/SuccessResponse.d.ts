export default class SuccessResponse {
    #private;
    constructor(success: boolean, message?: string);
    get success(): boolean;
    get message(): string | undefined;
    static success(): SuccessResponse;
    static error(message: string): SuccessResponse;
}
