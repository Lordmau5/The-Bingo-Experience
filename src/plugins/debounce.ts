import {
	debounce
} from 'ts-debounce';

const DebouncePlugin = (({
	options, store
}: any) => {
	if (options.debounce) {
	// we are overriding the actions with new ones
		return Object.keys(options.debounce).reduce((debouncedActions, action) => {
			// @ts-ignore
			debouncedActions[action] = debounce(
				store[action],
				options.debounce[action]
			);

			return debouncedActions;
		}, {
		});
	}
});

export default DebouncePlugin;
