export default function Button({children, onClick} : {children: React.ReactNode, onClick: () => void}) {
    return (
        <button onClick={onClick} className="h-full cursor-pointer border-2 rounded-sm p-2">
            {children}
        </button>
    )
}