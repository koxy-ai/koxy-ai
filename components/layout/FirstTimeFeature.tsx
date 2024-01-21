"use client"

import { Heading, Text, Button } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import DashedBorders from "@/components/DashedBorders"
import { ReactNode } from "react"

type Props = {
	icon: string,
	title: string,
	description: string,
	children?: ReactNode
}

export default function FirstTimeFeature({ icon, title, description, children }: Props) {
	return (
		<div className="w-full flex flex-col relative p-14 gap-2 group">
			<DashedBorders />
			<Heading size="5" mb="1">{title}</Heading>
			<div className="max-w-[80%] mb-2 flex">
				<p 
					className="text-foreground/70 text-[.9rem] mb-3"
				>
					{description}
				</p>
			</div>
			{children}
		</div>
	)
}