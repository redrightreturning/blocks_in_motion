export default function Button({children, onClick} : {children: React.ReactNode, onClick: () => void}) {
    return (
        <button onClick={onClick} className="hover:bg-canvas-background bg-background h-full cursor-pointer border-2 rounded-sm p-2 transition-colors duration-500 hover:duration-200">
            {children}
        </button>
    )
}