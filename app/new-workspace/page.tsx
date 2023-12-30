"use client"

import { useEffect, useState } from 'react'
import Auth, { type Props } from '../auth/Auth'
import getAllWorkspaces from '../workspaces/getAll'
import LoadingPage from '../../components/loading/page'
import { Card, Heading, Flex, Text, TextField, Select, Badge, Link } from '@radix-ui/themes'

const NewWorkspace = () => ( <Auth Comp={Page} /> )

function Page({ user }: Props) {

	const [workspaces, setWorkspaces]: any = useState(null)

	useEffect( () => {
		getAllWorkspaces().then( (data: any) => {
			if (data) {
				setWorkspaces(JSON.stringify(data))
			}
		})
	}, [])

	if (!workspaces) {
		return <LoadingPage info="Loading workspaces" />
	}

	return (
		<div className="flex w-full h-screen items-center justify-center">
			<div className="w-96 h-96 bg-purple-500/20 fixed z-10 m-4 blur-[100px] rounded-[99rem]"></div>
			<div className="fixed z-20">
				<Card className="p-6 w-[30rem] h-[30rem]">
					<Flex
						direction="column"
						gap="5"
					>
						<div className="mb-2 flex flex-col gap-2">
							<Heading>
								Create new workspace
							</Heading>
							<Text
								size="3"
								color="gray"
							>
								Workspaces are containers for your models, functions, databases, and deployments
							</Text>
						</div>
						<Select.Root defaultValue="owner" size="3">
							<Select.Trigger />
							<Select.Content position="popper">
								<Select.Item value="owner">
									<div className="flex items-center gap-2 font-bold">
										<img
											src={user?.user_metadata?.avatar_url}
											className="w-6 rounded-xl"
										/>
										{user?.user_metadata?.full_name}
									</div>
								</Select.Item>
							</Select.Content>
						</Select.Root>
						<TextField.Input
							id="workspaceName"
							placeholder="Enter workspace name…"
							size="3"
						/>
						<Select.Root defaultValue="basic" size="3">
							<Select.Trigger />
							<Select.Content position="popper">
								<Select.Item value="basic">
									<div className="flex items-center gap-2">
										Basic plan
										<Badge variant="outline" color="gray">$20</Badge>
									</div>
								</Select.Item>
								<Select.Item value="pro">
									<div className="flex items-center gap-2">
										Pro plan
										<Badge variant="outline" color="gray">$75</Badge>
									</div>
								</Select.Item>
							</Select.Content>
						</Select.Root>
						<Link
							size="2"
							color="gray"
						>
							Learn more about pricing plans
						</Link>
					</Flex>
				</Card>
			</div>
		</div>
	)

}

export default NewWorkspace