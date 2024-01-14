export default function pageInfo(name: string, description?: string) {
	document.title = name + " | Koxy AI";
	(document as any).description = description || "Your AI-powered Serverless platform"
}