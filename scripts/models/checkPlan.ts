
import planScore from "../planScore"

export default function checkPlan(workspacePlan: string, requiredPlan: string): Boolean {

	const currentPlanScore: number = planScore(workspacePlan)
	const requiredPlanScore: number = planScore(requiredPlan)

	return (currentPlanScore >= requiredPlanScore) ? true : false

}