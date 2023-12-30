"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"

import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "../sidebarActions"
import { toast } from "sonner"

import { Heading, Text, Button, Tooltip, DropdownMenu, Badge } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import DashedBorders from "@/components/DashedBorders"

import categories, { type Category } from "./categories"
import isArray from "@/scripts/isArray"

type CategoryProps = {
	categoryModels: Array<any>,
	activeCategory: number
}

const FindModels = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "models"
		},
		sidebar: {
			actions,
			active: "find_models"
		}
	}

	const router = useRouter()

	const [ activeCategory, setActiveCategory ] = useState(0)
	const [ categoryModels, setCategoryModels ] = useState<Array<any>>([])

	useEffect(() => {
		categories[activeCategory].api().then( (data: any) => {
			isArray(data, (data: Array<any>) => {
				setCategoryModels(data)
			})
		})
	}, [])

	const changeCategory = (index: number) => {
		if (activeCategory === index) {
			return undefined
		}
		setCategoryModels([])
		setActiveCategory(index)
		categories[index].api().then( (data: any) => {
			isArray(data, (data: Array<any>) => {
				setCategoryModels(data)
			})
		})
	}

	const openAlert = () => {
		toast("Something went wrong", {
			description: "This is a simple error",
			cancel: {
				label: "Got it",
		    },
		})
	}

	return (
		<WorkspaceLayout config={config}>
			<main className="innerMain">

				<div className="mainHead">
					<WorkspaceHeadInfo
						icon="search"
						title="Find models"
						info="Find thousands of models to customize and deploy"
					/>
					<div className="w-full flex items-center justify-end gap-6">
						<Button onClick={() => {openAlert()}} color="gray" variant="outline" size="2">
							<Icon id="book" />
							Docs
						</Button>
					</div>
				</div>

				<div className="p-6">

					<div className="flex items-center gap-3 overflow-x-auto">
						{categories.map(category => (
							<div
								onClick={() => { changeCategory(categories.indexOf(category)) }}
								key={categories.indexOf(category)}
							>
								<CategoryButton category={category} activeCategory={activeCategory} />
							</div>
						))}
					</div>

					<CategoryHead categoryModels={categoryModels} activeCategory={activeCategory} />

					{categoryModels.length < 1 ? <Loading /> : null}

					<div className="flex flex-col gap-6 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 transition-all">
						{categoryModels.map(model => (
							<div
								onClick={() => {
									const categoryPath = categories[activeCategory]?.modelPath
									const path = `/${workspace.id}/models/${categoryPath}?model_id=${model.id}`
									router.push(path)
								}}
								key={model._id}
							>
								<Model model={model} />
							</div>
						))}
					</div>

				</div>

			</main>
		</WorkspaceLayout>
	)

}

function CategoryHead({ categoryModels, activeCategory }: CategoryProps) {
	return (
		<div className="p-12 flex gap-3 relative mt-6 mb-6 border-1 rounded-xl border-[#41414141] bg-[#23232323]">
			<div className="flex flex-col gap-3 w-full justify-center">
				<Badge
					variant="outline"
					style={{
						maxWidth: "max-content"
					}}
				>
					{categories[activeCategory].id}
				</Badge>
				<Heading>{categories[activeCategory].name}</Heading>
				<Text size="2" color="gray" mb="1">{categories[activeCategory].info}</Text>
				<RecommendedModel activeCategory={activeCategory} categoryModels={categoryModels} />
			</div>
			<div className="w-full flex items-center justify-center">
				<CategoryIcon activeCategory={activeCategory} />
			</div>
		</div>
	)
}

function RecommendedModel({ categoryModels, activeCategory }: CategoryProps) {

	if (categoryModels.length < 1) {
		return <div className="p-3 text-gray-300 rounded-md bg-[#31313131] w-24 animate-pulse"></div>
	}

	return (
		<div className="recommendedModel">
			<Icon id="sparkles" />
			<Tooltip content="recommended">
				<div className="text-xs flex items-center gap-2">
					{categoryModels[categories[activeCategory].recommended]?.id}
				</div>
			</Tooltip>
		</div>		
	)

}

function Model({ model }: { model: any }) {
	return (
		<div className="modelCard">
			<div className="flex flex-col gap-3 w-full truncate">
				<Tooltip content={model.id}>
					<div className="flex items-center gap-1 text-gray-400">
						{
							model.downloads > 500000 ? <Icon id="discount-check-filled" /> : null
						}
						<Heading size="3" color="gray">
							{model.id}
						</Heading>
					</div>
				</Tooltip>
				<div className="flex items-center gap-3 opacity-60">
					<div className="flex items-center gap-1">
						<Icon id="test-pipe" />
						<div className="text-xs">{model.pipeline_tag}</div>
					</div>
					<div className="flex gap-1">
						<Icon id="coins" />
						<div className="text-xs">{model.price || "free"}</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end max-h-max opacity-70 pl-4">
				<div className="flex gap-1">
					<Icon id="package" />
					<div className="text-xs">{model.library_name}</div>
				</div>
			</div>
		</div>
	)
}

function CategoryButton({ category, activeCategory }: { category: Category, activeCategory: number }) {
	return (
		<button className={`${activeCategory === categories.indexOf(category) ? "activeCategoryButton" : "categoryButton"}`}>
			<div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#35353535]">
				<div className="opacity-80">
					<Icon id={category.icon} size="small" />
				</div>
			</div>
			<Text size="2" color="gray">{category.name}</Text>
		</button>
	)
}

function CategoryIcon({ activeCategory }: { activeCategory: number }) {
	return (
		<div className="w-36 h-36 flex items-center justify-center relative">
				<DashedBorders />
			<div className="categoryIcon">
				<Icon id={categories[activeCategory].icon} size="21px" />
				<DashedBorders />
			</div>
		</div>
	)
}

function Loading() {
	return (
		<div className="flex flex-col gap-6 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 transition-all animate-pulse">
			<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
			<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
			<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
		</div>
	)
}

export default FindModels