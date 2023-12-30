"use client"

import requireAuth from "@/app/auth/require"
import Auth, { type Props } from "@/app/auth/Auth"
import LoadingPage from "@/components/loading/page"
import Icon from "@/components/Icon"
import createWorkspace from "@/app/actions/workspaces/create"
import getCreatedWorkspaces from "@/app/actions/user/getCreatedWorkspaces"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { openAlert } from "@/components/Alert"
import is from "@/scripts/is"

import {
	Heading,
	Text,
	Card,
	Flex,
	Badge,
	Button,
	Link,
	Dialog,
	TextField,
	Kbd
} from "@radix-ui/themes"

const Welcome = () => ( <Auth Comp={Page} /> )

function Page({ user }: Props) {

	const router = useRouter()

	const [ isAllowed, setAllowed ] = useState(false)

	useEffect( () => {
		getCreatedWorkspaces().then( (data: Array<any>) => {
			if (!data) {
				return undefined
			}
			if (data.length > 0) {
				router.push("/")
			} else {
				setAllowed(true)
			}
		})
	}, [])

	if (!isAllowed) {
		return <LoadingPage info="Loading workspaces data" />
	}

	if (!user) {
		return <LoadingPage info="Loading Koxy AI" />
	}

	return (
		<>
			<div
				className="fixed top-40 left-20 z-10 w-64 h-64 rounded-[99rem] bg-purple-400/20"
				style={{
					filter: "blur(100px)"
				}}
			></div>
			<div
				className="fixed top-20 right-20 z-10 w-64 h-64 rounded-[99rem] bg-purple-400/20"
				style={{
					filter: "blur(100px)"
				}}
			></div>
			<div className="w-screen p-24 flex flex-col items-center gap-3 fixed top-0 left-0 overflow-y-auto z-20">

				<UserBadge user={user} />
				<Heading size="8">
					Getting started
				</Heading>
				<Text id="text-3333333" size="3" color="gray">
					Create or join a workspace to start building with Koxy AI
				</Text>
				<Link>What are workspaces?</Link>

				<div
					className="w-full flex items-center mt-10"
				>

					<div className="w-full p-10">
						<Card
							style={{
								padding: ".4rem",
								background: "transparent"
							}}
						>
							<Flex direction="column" gap="4">
								<div>
									<Text size="2" color="gray">
										<Flex align="center" gap="1">
											<Icon id="wallet" />
											Billed by {user?.user_metadata?.full_name}
										</Flex>
									</Text>
									<Heading mb="1" mt="2" size="3">New Workspace</Heading>
								</div>
								<Dialog.Root>
									<Dialog.Trigger>
										<Button
											variant="surface"
											mt="2"
											style={{
												maxWidth: "max-content"
											}}
										>
											Create workspace
											<Icon id="chevron-right" />
										</Button>
									</Dialog.Trigger>
									<Create router={router} />
								</Dialog.Root>
							</Flex>
						</Card>
					</div>

					<Badge color="gray" variant="surface">
						/or
					</Badge>

					<div className="w-full p-10">
						<Card
							style={{
								padding: ".4rem",
								background: "transparent"
							}}
						>
							<Flex direction="column" gap="4">
								<div>
									<Text size="2" color="gray">
										<Flex align="center" gap="1">
											<Icon id="mailbox" />
											Invitation required
										</Flex>
									</Text>
									<Heading mb="1" mt="2" size="3">Join Workspace</Heading>
								</div>
								<Flex align="center" gap="2">
									<Button
										variant="surface"
										mt="2"
										style={{
											maxWidth: "max-content"
										}}
									>
										Join workspace
										<Icon id="chevron-right" />
									</Button>
									
								</Flex>
							</Flex>
						</Card>
					</div>
				</div>
			</div>
		</>
	)

}

function UserBadge({ user }: Props) {

	return (
		<div className="flex items-center gap-2 p-1 pl-2 pr-2 border-1 border-purple-500 bg-purple-500/10 rounded-xl">
			<img
				src={`${user?.user_metadata?.avatar_url}`}
				className="w-4 rounded-xl"
			/>
			<p className="text-xs">{user?.user_metadata?.full_name}</p>
		</div>
	)

}

function Create({ router }: {router: any}) {

	const cw = () => {
		const elm: HTMLInputElement | null = document.getElementById("workspaceName") as HTMLInputElement
		if (!elm) {
			return undefined
		}
		const name = elm.value
		createWorkspace(name).then( (data: any) => {
			if (data.err) {
				is ([data.err, "string"], (error: string) => ( openAlert("error", error) ))
				is ([data.err, "object"], (error: any) => ( openAlert("error", error.msg) ))
			} else {
				openAlert("success", `Created workspace: ${name}`)
				router.push("/")
			}
		})
	}

	return (
		<Dialog.Content
			style={{
				maxWidth: 400,
				backgroundColor: "rgba(7, 7, 7, .7)",
				backdropFilter: "blur(5px)",
			}}
		>
			<Dialog.Title mb="2">Create workspace</Dialog.Title>
			<Dialog.Description size="2" color="gray" mb="5">
				Workspaces are containers for your models, functions, databases, deployments, and more...
			</Dialog.Description>
			<Flex direction="column" gap="2">
				<TextField.Input
					id="workspaceName"
				    placeholder="Enter workspace name (2-24 characters)"
				    mb="2"
				/>
				
				<div className="w-full flex items-center justify-end gap-3">
					<Dialog.Close>
						<Button
							variant="soft"
							color="gray"
							mt="2"
							style={{
								maxWidth: "max-content"
							}}
						>
							Cancel
							<Badge variant="surface">Esc</Badge>
						</Button>
					</Dialog.Close>
					<Button
						onClick={cw}
						variant="surface"
						mt="2"
						style={{
							maxWidth: "max-content"
						}}
					>
						Create
						<Icon id="chevron-right" />
					</Button>
				</div>

			</Flex>
		</Dialog.Content>
	)

}

export default Welcome