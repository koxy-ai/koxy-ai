"use client"

import { Heading, Text, Button } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import DashedBorders from "@/components/DashedBorders"

type Props = {
	icon: string,
	title: string,
	description: string,
	button: {
		title: string,
		action: Function
	}
}

export default function FirstTimeFeature({ icon, title, description, button }: Props) {
	return (
		<div className="w-full flex flex-col items-center justify-center relative p-14 gap-2 group">
			<DashedBorders />
			<div
				className="flex items-center justify-center p-3.5 mb-3 rotate-[-20deg] group-hover:border-pink-500/70 transition-all relative text-pink-300 border-1 border-pink-500/50 bg-pink-500/10 rounded-md"
				style={{
					boxShadow: "0px 0px 50px 5px rgba(236,72,153, .07)"
				}}
			>
				<div
					className="opacity-60"
					style={{
						boxShadow: "0px 0px 50px 10px rgb(236,72,153)"
					}}
				>
					<DashedBorders />
				</div>
				<Icon id={icon} size="larger" />
			</div>
			<Heading className="textGradient" mt="1">{title}</Heading>
			<div className="max-w-[70%] mb-3 flex items-center justify-center">
				<Text size="3" color="gray" align="center" mb="1">
					{description}
				</Text>
			</div>
			<Button onClick={() => button.action()} variant="surface">{button?.title}</Button>
		</div>
	)
}