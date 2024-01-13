class Once {

	state: "expired" | "ready" = "ready"
	action: Function | null = null

	constructor(action?: Function) {
		if (action) {
			this.action = action
		}
	}

	setAction(action: Function) {
		this.action = action
		return this
	}

	isState() {
		return (this.state === "ready") ? true : false
	}

	async execute(force: Boolean, parameters?: any) {
		if (force) {
			const res = await this.action(parameters || {})
			return res
		}

		const check = this.isState()
		if (check) {
			this.state = "expired"
			const res = await this.action(parameters || {})
			return res
		}

	}

}

export default Once