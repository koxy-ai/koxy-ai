
import isArray from "@/scripts/isArray"
import is from "@/scripts/is"

export type PrsedModelData = {
	id: string,
	pipeline_tag: string,
	license: string | null,
	plan: string,
	developer: string | null,
	model_type: string | null,
	architecture: string | null,
	datasets: Array<string>,
	tasks: Array<any>,
	papers: Array<string>
}

export default function parseModelData(model: any) {

	const parsedData: PrsedModelData = {
		id: model.id,
		pipeline_tag: model.pipeline_tag,
		license: model?.cardData?.license || null,
		plan: model?.plan || "free",
		developer: getDeveloper(model),
		model_type: model?.config?.model_type || null,
		architecture: getArchitecture(model),
		datasets: getDatasets(model),
		tasks: getTasks(model),
		papers: getPapers(model)
	}

	return parsedData

}

function getDeveloper(model: any): string | null {

	if (model.id.includes("/")) {
		return model.id.split("/")[0]
	}

	return model?.author || null

}

// This functions will return the first model's architecture if any
function getArchitecture(model: any): string | null {

	const architecture: { value: string | null } = {
		value: null
	}
	const architectures = model?.config?.architectures

	isArray(architectures, (data: Array<string>) => {
		if (data.length > 0) {
			architecture.value = data[0]
		}
	})

	return architecture.value

}

// This function will return an array of the model's datasets if any
function getDatasets(model: any): Array<string> {

	const res = []
	const datasets = model?.cardData?.datasets

	isArray(datasets, (data: Array<string>) => ( data.forEach(dataset => ( res.push(dataset) )) ))

	return res

}

function getTasks(model: any): Array<any> {

	const res = []
	const tasksParams = model?.config?.task_specific_params

	if (!tasksParams) {
		res.push({
			id: "main"
		})
		return res
	}

	is([tasksParams, "object"], (tasks: any) => {
		
		Object.keys(tasks).forEach( (key) => {

			const value = tasks[key]

			res.push({
				id: key,
				...value
			})

		})

	})

	if (res.length < 1) {
		res.push({
			id: "/"
		})
	}

	return res

}

function getPapers(model: any): Array<string> {

	const tags = model?.tags

	if (!tags) {
		return []
	}

	const res = tags.filter((tag: string) => tag.substring(0, 6) === "arxiv:")

	return res || []

}