const stringConstructor = 'test'.constructor;
const arrayConstructor = [].constructor;
const objectConstructor = ({}).constructor;

export function isEmpty(value: any) {
	return (value === undefined || value === '' || value === null);
}

export const isEmptyObject = (value: {}) => {
	return isEmpty(value)? true : (Object.keys(value).length === 0 && value.constructor === Object);
};

function whatKindOf(object) {
	if (object === null) {
		return 'null';
	}
	if (object === undefined) {
		return 'undefined';
	}
	if (object.constructor === stringConstructor) {
		return 'String';
	}
	if (object.constructor === arrayConstructor) {
		return 'Array';
	}
	if (object.constructor === objectConstructor) {
		return 'Object';
	}
	if (typeof object === 'function') {
		return 'Function';
	}
	{
		return 'don\'t know';
	}
}

export const typeCheck = {
	isObject: (val) => (whatKindOf(val) === 'Object' && val !== null),
	isString: (val) => whatKindOf(val) === 'String',
	isArray: (val) => whatKindOf(val) === 'Array',
	isFunction: (val) => whatKindOf(val) === 'Function'
};