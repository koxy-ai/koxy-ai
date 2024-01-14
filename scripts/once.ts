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

	async execute(options?: { force?: Boolean, parameters?: any }) {
		options = options || {}

		if (!this.action) {
			return null
		}

		if (options.force) {
			const res: any = await this.action(options.parameters || {})
			return res
		}

		const check = this.isState()
		if (check) {
			this.state = "expired"
			const res: any = await this.action(options.parameters || {})
			return res
		}

	}

}

export default Once