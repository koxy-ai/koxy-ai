
import planScore from "../planScore"

export default function checkPlan(workspacePlan: string, requiredPlan: string): Boolean {

	const currentPlanScore = planScore(workspacePlan)
	const requiredPlanScore = planScore(requiredPlan)

	if (currentPlanScore === undefined || requiredPlanScore === undefined) {
		return false
	}

	return (currentPlanScore >= requiredPlanScore) ? true : false

}