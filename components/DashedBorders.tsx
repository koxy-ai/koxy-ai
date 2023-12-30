export default function DashedBorders() {

	return (
		<>
			<div className="absolute top-0 left-3 h-full border-r-1 border-[var(--gray-a5)] border-dashed"></div>
			<div className="absolute top-0 right-3 h-full border-r-1 border-[var(--gray-a5)] border-dashed"></div>
			<div className="absolute top-3 left-0 w-full border-t-1 border-[var(--gray-a5)] border-dashed"></div>
			<div className="absolute bottom-3 left-0 w-full border-t-1 border-[var(--gray-a5)] border-dashed"></div>
		</>
	)

}