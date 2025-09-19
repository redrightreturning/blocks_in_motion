export default function Button({children, onClick} : {children: React.ReactNode, onClick: () => void}) {
    return (
        <button onClick={onClick} className="cursor-pointer">
            {children}
        </button>
    )
}