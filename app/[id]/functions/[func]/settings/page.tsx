"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import createActions from "../sidebarActions"
import pageInfo from "@/scripts/pageInfo"

import { Text, Badge, Heading, Button, Dialog, TextField } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import SubmitButton from "@/components/SubmitButton"

import { toast } from "sonner"
import getFunction, { type FuncRes } from "@/app/actions/deno/projects/get"
import Once from "@/scripts/once"
import is from "@/scripts/is"
import deleteFunction from "@/app/actions/deno/projects/delete"
import updateFunction from "@/app/actions/deno/projects/update"

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

	const router = useRouter()
	const [ active, setActive ] = useState<string>("Basic")

	const buttons = [
		{
			id: "Basic",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Environment-variables",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Domains",
			color: "hover:bg-[#31313131]"
		},
		{
			id: "Danger-zone",
			color: "hover:bg-red-500/10"
		}
	]

	const changeWindow = (id: string) => {
		setActive(id)
		router.push(`#${id}`)
	}

	return (
		<div className="flex gap-5 relative">
			<div className="min-w-[13rem] max-w-[13rem] h-full flex flex-col gap-3 pt-3 fixed">
				<div className="flex items-center gap-2 mb-2">
					<div className="w-6 h-6 flex items-center justify-center border-1 border-pink-500/50 rounded-md">
						<Icon id="settings-code" />
					</div>
					<Text>{func.name}</Text>
				</div>

				{buttons.map(button => (
					<div key={`${button.id}-button`} onClick={() => changeWindow(button.id)} >
						{(button.id === active)
							? <ActiveTabButton title={button.id} color={button.color} />
							: <TabButton title={button.id} color={button.color} />}
					</div>
				))}
			</div>

			<div className="w-full flex flex-col gap-6 ml-[14.5rem]">
				<div onMouseOver={() => setActive("Basic")}>
					<TabWindow func={func} id="Basic">
						<BasicSettings func={func} />
					</TabWindow>
				</div>

				<div onMouseOver={() => setActive("Environment-variables")}>
					<TabWindow func={func} id="Environment-variables">
						<EnvSettings func={func} />
					</TabWindow>
				</div>

				<div onMouseOver={() => setActive("Domains")}>
					<TabWindow func={func} id="Domains">
						<DomainsSettings func={func} />
					</TabWindow>
				</div>

				<div onMouseOver={() => setActive("Danger-zone")}>
					<TabWindow func={func} id="Danger-zone">
						<DangerSettings func={func} />
					</TabWindow>
				</div>

			</div>

		</div>
	)
}

function TabWindow({ func, id, children }: { func: FuncRes, id: string, children: React.JSX.Element }) {

	return (
		<div id={id}>
			{children} 
		</div>
	)

}

function TabButton({ title, color }: { title: string, color: string }) {

	return (
		<button className={`p-1 w-full pl-2 pr-2 border-1 border-transparent ${color} rounded-md text-start flex items-center group`}>
			<div className="w-full truncate text-sm">{title.replace("-", " ")}</div>
			<div className="flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-300">
				<Icon id="chevron-right" />
			</div>
		</button>
	)

}

function ActiveTabButton({ title, color }: { title: string, color: string }) {

	return (
		<button className={`p-1 w-full pl-2 pr-2 border-1 border-[var(--gray-a4)] ${color} rounded-md text-start flex items-center group`}>
			<div className="w-full truncate text-sm">{title.replace("-", " ")}</div>
			<div className="flex items-center justify-center transition-all duration-300">
				<Icon id="chevron-right" />
			</div>
		</button>
	)

}

function BasicSettings({ func }: { func: FuncRes }) {

	const [ name, setName ] = useState<string>("")

	const changeName = () => {
		const elm = document.getElementById("updateFuncName") as HTMLInputElement
		if (elm) {
			const value = elm.value
			setName(value || "")
		}
	}

	const updateName = async () => {
		const res = await updateFunction(func?.id, name)
		const title = (res.success) ? "Updated function name" : `Something went wrong`
		toast(title, {
			description: res.message || "",
			cancel: {
				label: "Got it"
			}
		})
		if (res.success) {
			location.href = location.href
		}
	}

	return (
		<div className="w-full rounded-md border-1 border-white/20 p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Basic</Badge>
			</div>

			<div className="w-full flex flex-col">
				<Text mb="1" size="4">Function name</Text>
				<Text color="gray">
					Change your function name. this will require you to update your function name in <Badge variant="surface">koxy-js</Badge>
				</Text>
			</div>

			<div className="mt-6 w-full flex items-center gap-4">
				<input
					id="updateFuncName"
					onInput={() => changeName()}
					className="inputDefault min-w-[40%]"
					placeholder="New function name..."
				/>
				<SubmitButton
					color="gray"
					variant="soft"
					action={updateName}
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
		<div className="w-full rounded-md border-1 border-white/20 p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Environment variables</Badge>
			</div>

			<div className="flex items-center">
				<div className="w-full flex flex-col">
					<Text mb="1" size="4">Environment variables</Text>
					<Text color="gray">
						Used to store sensetive information like API keys.<br />
					</Text>
					<Text color="gray">
						can be accessed using <Badge variant="surface">Deno.env</Badge>
					</Text>
				</div>

				<div className="flex items-center justify-end">
					<Button
						color="gray"
						variant="soft"
						size="2"
					>
						<div className="flex items-center gap-1">
							Update variables
						</div>
					</Button>
				</div>
			</div>
		</div>
	)

}

function DomainsSettings({ func }: { func: FuncRes }) {

	return (
		<div className="w-full rounded-md border-1 border-white/20 p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Domains</Badge>
			</div>

			<div className="flex items-center">
				<div className="w-full flex flex-col">
					<Text mb="1" size="4">Domains</Text>
					<Text color="gray">
						Associate a custom domain with this function
					</Text>
				</div>

				<div className="flex items-center justify-end">
					<SubmitButton
						color="gray"
						variant="soft"
						action={async () => {
							await fetch("https://api.github.com")
						}}
						size="2"
					>
						<div className="flex items-center gap-1">
							Connect domain
						</div>
					</SubmitButton>
				</div>
			</div>
		</div>
	)

}

function DangerSettings({ func }: { func: FuncRes }) {

	const [ name, setName ] = useState<string>("")
	const workspaceId = usePathname().split("/")[1]
	const router = useRouter()

	const changeName = () => {
		const elm = document.getElementById("deleteFuncName") as HTMLInputElement
		if (elm) {
			const value = elm.value
			setName(value)
		}
	}

	const deleteAction = async () => {
		const res: Boolean = await deleteFunction(func?.id)
		const title = (res) ? "Deleted function" : "Unexpected error"
		toast(title, {
			cancel: {
				label: "Got it"
			}
		})
		const closeButton = document.getElementById("deleteCloseButton") as any
		closeButton.click()
		if (res) {
			router.push(`/${workspaceId}/functions`)
			return null
		}
	}

	return (
		<div className="w-full rounded-md border-1 border-red-500/50 bg-red-500/5 p-6 relative">
			<div className="flex items-center gap-3 mb-6">
				<Badge color="gray">Settings</Badge>
				<Text color="gray">/</Text>
				<Badge color="gray">Danger zone</Badge>
			</div>

			<div className="flex items-center">
				<div className="w-full flex flex-col">
					<Text mb="1" size="4">Delete function</Text>
					<Text color="gray">
						Delete this function and all its deployments.
					</Text>
				</div>

				<div className="flex items-center justify-end">
					<Dialog.Root>
						<Dialog.Trigger>
							<Button
								color="red"
								variant="surface"
								size="2"
							>
								<div className="flex items-center gap-1">
									<Icon id="trash" />
									Delete function
								</div>
							</Button>
						</Dialog.Trigger>
						<Dialog.Content
							style={{
							    maxWidth: 500,
							    backgroundColor: "rgba(50, 50, 50, .1)",
							    backdropFilter: "blur(5px)",
							    borderRadius: "10px"
							}}
						>
							<Dialog.Title mb="1">Delete function</Dialog.Title>
							<Text color="gray">Enter the function name to delete it (<b>{func?.name}</b>)</Text>
							<TextField.Input
								id="deleteFuncName" mt="4" mb="4" 
								placeholder="Enter function name" 
								color="red"
								onInput={() => changeName()}
							/>
							<div className="flex items-center justify-end gap-4">
								<Dialog.Close>
									<Button id="deleteCloseButton" color="gray" variant="soft">
										<div className="flex items-center gap-2">
											Cancel
											<Badge variant="surface">esc</Badge>
										</div>
									</Button>
								</Dialog.Close>
								{
									(name === func?.name)
										? <SubmitButton action={deleteAction} color="red">
											<div className="flex items-center gap-1">
												<Icon id="trash" /> Delete
											</div>
										</SubmitButton>
										: <Button variant="surface" color="gray" disabled>
											<div className="flex items-center gap-1">
												<Icon id="trash" /> Delete
											</div>
										</Button>
								}
							</div>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</div>
		</div>
	)

}

function SettingsLoading() {
	return <>loading</>
}

export default Template