export default function is(value: Array<any>, cb: Function): void {

	if (!value[0]) {
		value[0] = undefined
	}

	if (value[1] === null && !value[0]) {
		cb(value[0])
	}

	else if (value[1] === "*" && value[1]) {
		cb(value[0])
	}

	else if (typeof value[0] === value[1]) {
		cb(value[0])
	}

}