type Props = {
    id: string,
    size?: string,
    options?: any
}

export default function Icon ({id, size, options}: Props) {
    return <i className={`ti ti-${id}`} style={{
        fontSize: size || "medium",
        ...(options || {})
    }}></i>
}