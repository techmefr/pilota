interface IProps {
    title: string
}

export default function Topbar({ title }: IProps) {
    return (
        <>
            <span className="page-title">{title}</span>
        </>
    )
}
