// / <reference types="node" />
import 'pinia';

declare module 'pinia' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export interface DefineStoreOptionsBase<S, Store> {
		// allow defining a number of ms for any of the actions
		debounce?: Partial<Record<keyof StoreActions<Store>, number>>
	}
}
