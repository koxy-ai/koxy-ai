type Props = {
    id: string,
    size?: string
}

export default function Icon ({id, size}: Props) {
    return <i className={`ti ti-${id}`} style={{
        fontSize: size || "medium"
    }}></i>
}