
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
	{
		id: "translation",
		name: "Translation",
		info: "Translate text from one language to another",
		icon: "language",
		recommended: 0,
		modelPath: "hf/",
		api: async () => ( await findHfModel("translation") )
	},
	{
		id: "table-question-answering",
		name: "Table Question Answering",
		info: "Never dive into a large spreadsheet. Ask questions in plain English!",
		icon: "table",
		recommended: 0,
		modelPath: "hf/",
		api: async () => ( await findHfModel("table-question-answering") )
	},
	{
		id: "fill-mask",
		name: "Fill Mask",
		info: "Tries to fill in a hole with a missing word (token to be precise)",
		icon: "square-letter-m",
		recommended: 0,
		modelPath: "hf/",
		api: async () => ( await findHfModel("fill-mask") )
	},
	{
		id: "text-generation",
		name: "Text Generation",
		info: "Used to continue text from a prompt",
		icon: "align-justified",
		recommended: 0,
		modelPath: "hf/",
		api: async () => ( await findHfModel("text-generation") )
	},
	{
		id: "sentence-similarity",
		name: "Sentence Similarity",
		info: "Calculate the similarity between a text and a list of other sentences",
		icon: "list-check",
		recommended: 0,
		modelPath: "hf/",
		api: async () => ( await findHfModel("sentence-similarity") )
	},

]

export default categories