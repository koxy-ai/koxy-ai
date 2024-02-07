import DashedBorders from "./DashedBorders"

type Props = {
    id: string,
    size?: string,
    options?: any
}

export default function Icon({ id, size, options }: Props) {
    return <i className={`ti ti-${id}`} style={{
        fontSize: size || "medium",
        ...(options || {})
    }}></i>
}

export function MainIcon({ icon, size, color }: { icon: string, size?: string, color: string }) {
    return (
        <div className="w-full h-36 flex items-center justify-center relative">
            <div className="flex w-24 h-24 relative items-center justify-center flex-col">
                <DashedBorders />
                <Icon id={icon} size={size || "30px"} />
                <div style={{ boxShadow: `0px 0px 150px 20px ${color}` }}></div>
            </div>
        </div>
    )
}