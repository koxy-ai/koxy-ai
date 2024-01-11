"use client"

import Icon from "@/components/Icon"
import { Text } from "@radix-ui/themes"

type Props = {
	id?: string,
	classes?: string,
	title: string,
	info: string,
	icon: string
}

export default function Card({ id, classes, title, info, icon }: Props) {

	return (
		<div
			id={id || `card-${Date.now()}`}
			className={`${classes} flex items-center group p-4 border-1 border-[var(--gray-a6)] bg-[#27272727] transition-all rounded-xl hover:border-pink-500/50 cursor-pointer hover:bg-pink-500/5`}
		>
			<div className="flex flex-col gap-1">
				<div className="w-9 h-9 group-hover:border-pink-500/50 transition-all duration-500 border-1 border-[var(--gray-a6)] gradient2 rounded-md flex items-center justify-center relative">
					<Text size="6" color="pink">{title[0]}</Text>
					<div className="w-5 h-5 bg-pink-500 text-black border-2 border-black rounded-xl absolute bottom-[-5px] right-[-8px] flex items-center justify-center">
						<Icon id="code" size="12px" />
					</div>
				</div>
				<Text mt="1">{title}</Text>
				<Text size="1" color="gray">{info}</Text>
			</div>
		</div>
	)

}
