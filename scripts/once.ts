class Once {

	state: string = "ready"
	action: Function | null = null
	id: string | null = null

	constructor(id?: string, action?: Function) {
		if (id) {
			this.id = id
			this.state = `${id}-ready`
		}
		if (action) {
			this.action = action
		}
	}

	setAction(action: Function) {
		this.action = action
		return this
	}

	setId(id: string) {
		this.id = id
		if (this.state === "ready") {
			this.state = `${id}-ready`
		}
		return this
	}

	isState() {
		return (this.state === `${this.id}-expired`) ? false : true
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
			this.state = `${this.id}-expired`
			const res: any = await this.action(options.parameters || {})
			return res
		}

	}

}

export default Once