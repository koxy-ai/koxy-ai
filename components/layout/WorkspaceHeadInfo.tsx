
import { Heading, Text } from "@radix-ui/themes"
import Icon from "../Icon"

type Props = {
	icon: string,
	title: string,
	info: string
}

export default function WorkspaceHeadInfo({ icon, title, info }: Props) {

	return (
		<div className="flex flex-col gap-3 min-w-max">
			<div className="flex items-center gap-2">
				<div className="w-[1.8rem] h-[1.8rem] flex items-center justify-center rounded-md bg-pink-500/10 border-1 border-pink-500/30 light drop-shadow-2xl relative">
					<Icon id={icon} />
				</div>
				<Heading size="5">{title}</Heading>
			</div>
			<div className="truncate hidden md:block">
				<Text color="gray" size="2">{info}</Text>
			</div>
		</div>
	)

}