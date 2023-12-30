export default function isArray(input: any, action: Function) {

	if (typeof input !== "object") {
		input = {}
	}

	const check = typeof input === "object" && JSON.stringify(input)[0] === "["

	if (!check) {
		return false
	}

	if (action) {
		action(input)
	}

	return true

}