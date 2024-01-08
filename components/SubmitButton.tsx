"use client"

import { useState } from "react"

type Props = {
	title: string,
	action: Function,
	size: string,
	variant: string,
	parameters?: any,
}

export default function SubmitButton({ ...props }: Props) {

	const [ state, setState ] = useState("default")

	const clickAction = async () => {
		if (state !== "loading") {
			setState("loading")
			await props.action(props?.parameters)
			setState("default")
		}
	}

	return (

		<button onClick={clickAction} className="">
			
		</button>

	)

}