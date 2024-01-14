"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import createActions from "../sidebarActions"
import pageInfo from "@/scripts/pageInfo"

import { Text, Badge, Heading, Button } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import SubmitButton from "@/components/SubmitButton"

import getFunction, { type FuncRes } from "@/app/actions/deno/projects/get"
import Once from "@/scripts/once"
import is from "@/scripts/is"

const Template = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	const router = useRouter()
	const functionId = usePathname().split("/")[3]
	const [ func, setFunc ] = useState<FuncRes | null>(null)

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions: createActions(functionId),
			active: "function-settings"
		}
	}

	useEffect(() => {
		getFunction(functionId).then( (data: FuncRes | null) => setFunc(data) )
	}, [])

	if (!func) {
		return (
			<WorkspaceLayout config={config}>
				<main className="innerMain p-6 relative h-screen">
					<SettingsLoading />
				</main>
			</WorkspaceLayout>
		)
	}

	return (
		<WorkspaceLayout config={config}>

			<main className="innerMain p-6 relative h-screen">
				<SettingsBody func={func} />
			</main>

		</WorkspaceLayout>
	)

}

function SettingsBody({ func }: { func: FuncRes }) {

	const [ active, setActive ] = useState<string>("Basic")

	const buttons = [
		{
			id: "Basic",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Environment variables",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Domains",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Danger zone",
			color: "hover:bg-red-500/10"
		}
	]

	return (
		<div className="flex gap-5">
			<div className="min-w-[13rem] h-full flex flex-col gap-3 pt-3">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-6 h-6 flex items-center justify-center border-1 border-pink-500/50 rounded-md">
						<Icon id="code" />
					</div>
					<Text>{func.name}</Text>
				</div>

				{buttons.map(button => (
					<div key={`${button.id}-button`} onClick={() => setActive(button.id)} >
						{(button.id === active)
							? <ActiveTabButton title={button.id} color={button.color} />
							: <TabButton title={button.id} color={button.color} />}
					</div>
				))}
			</div>

			<TabWindow func={func} isActive={("Basic" === active)}>
				<BasicSettings func={func} />
			</TabWindow>

			<TabWindow func={func} isActive={("Environment variables" === active)}>
				<EnvSettings func={func} />
			</TabWindow>

		</div>
	)
}

function TabWindow({ func, isActive, children }: { func: FuncRes, isActive: Boolean, children: React.JSX.Element }) {

	if (!isActive) {
		return null
	}

	return (
		<> {children} </>
	)

}

function TabButton({ title, color }: { title: string, color: string }) {

	return (
		<button className={`p-1 w-full pl-2 pr-2 border-1 border-transparent ${color} rounded-md text-start flex items-center group`}>
			<div className="w-full truncate text-sm">{title}</div>
			<div className="flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-300">
				<Icon id="chevron-right" />
			</div>
		</button>
	)

}

function ActiveTabButton({ title, color }: { title: string, color: string }) {

	return (
		<button className={`p-1 w-full pl-2 pr-2 border-1 border-[var(--gray-a4)] ${color} rounded-md text-start flex items-center group`}>
			<div className="w-full truncate text-sm">{title}</div>
			<div className="flex items-center justify-center transition-all duration-300">
				<Icon id="chevron-right" />
			</div>
		</button>
	)

}

function BasicSettings({ func }: { func: FuncRes }) {

	return (
		<div className="w-full rounded-xl border-1 border-[var(--gray-a5)] p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Basic</Badge>
			</div>

			<Heading mb="1" size="5">Function name</Heading>
			<Text color="gray">
				Change your function name. this will require you to update your function name in <Badge variant="surface">koxy-js</Badge>
			</Text>

			<input
				className="bg-[#29292929] border-1 border-[var(--gray-a5)] w-full p-1.5 pl-3 text-sm rounded-md mt-5 outline-0 focus:border-white/30 transition-all"
				placeholder="New function name..."
			/>

			<div className="mt-6 w-full flex items-center ">
				<SubmitButton
					action={async () => {
						await fetch("https://api.github.com")
					}}
					size="2"
				>
					<div>Save changes</div>
				</SubmitButton>
			</div>
		</div>
	)

}

function EnvSettings({ func }: { func: FuncRes }) {

	return (
		<div className="w-full rounded-xl border-1 border-[var(--gray-a5)] p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Environment variables</Badge>
			</div>

			<Heading mb="1" size="5">Environment variables</Heading>
			<Text color="gray">
				Used to store sensetive information like API keys. can be accessed using <Badge variant="surface">Deno.env</Badge>
			</Text>

			<div className="mt-6 w-full flex items-center ">
				<SubmitButton
					action={async () => {
						await fetch("https://api.github.com")
					}}
					size="2"
				>
					<div>Update variables</div>
				</SubmitButton>
			</div>
		</div>
	)

}

function SettingsLoading() {
	return <>loading</>
}

export default Template