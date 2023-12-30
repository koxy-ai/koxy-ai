
import findHfModel from "@/app/actions/models/find/hf"

export type Category = {
	id: string,
	name: string,
	icon: string,
	info: string,
	recommended: number,
	modelPath: string,
	api: Function
}

const categories: Array<Category> = [

	{
		id: "summarization",
		name: "Summarization",
		info: "Used to summarize longer text into short paragraphs",
		icon: "text-caption",
		recommended: 1,
		modelPath: "hf",
		api: async () => ( await findHfModel("summarization") )
	},
	{
		id: "text-classification",
		name: "Text Classification",
		info: "Used to get the likelihood of an input",
		icon: "text-recognition",
		recommended: 3,
		modelPath: "hf/",
		api: async () => ( await findHfModel("text-classification") )
	},

]

export default categories