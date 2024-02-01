export default class SuccessResponse {
	#success: boolean;

	#message: string | undefined;

	constructor(
		success: boolean,
		message?: string
	) {
		this.#success = success;
		this.#message = message;
	}

	get success(): boolean {
		return this.#success;
	}

	get message(): string | undefined {
		return this.#message;
	}

	static success() {
		return new SuccessResponse(true);
	}

	static error(message: string) {
		return new SuccessResponse(false, message);
	}
}
