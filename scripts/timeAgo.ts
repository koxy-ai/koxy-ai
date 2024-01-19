import { formatDistanceToNow } from "date-fns"

export default function timeAgo(date: string) {
	const dateObject = new Date(date)
	return formatDistanceToNow(dateObject, { addSuffix: true })
}