const colors = [
	'red',
	'pink',
	'purple',
	'deep-purple',
	'indigo',
	'blue',
	'light-blue',
	'cyan',
	'teal',
	'green',
	'light-green',
	'lime',
	'yellow',
	'amber',
	'orange',
	'deep-orange',
	'brown',
	'grey',
	'blue-grey'
];

import stringHash from '@sindresorhus/string-hash';

export function stringCompare(str1: string, str2: string): boolean {
	return str1.localeCompare(str2, undefined, {
		sensitivity: 'accent'
	}) === 0;
}

export function getColorForString(input: string): string {
	return colors[stringHash(input) % colors.length];
}
