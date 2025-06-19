import { ReactNode } from 'react'

interface CardStackProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

export default function CardStack({ children, className = '', hover = true }: CardStackProps) {
    return (
        <div className={`
            relative group
            ${hover ? 'hover:translate-y-[-2px] transition-transform duration-300' : ''}
            ${className}
        `}>
            {/* Shadow layers for depth */}
            <div className="absolute inset-0 bg-gray-900 opacity-5 translate-x-1 translate-y-1"></div>
            <div className="absolute inset-0 bg-gray-900 opacity-3 translate-x-0.5 translate-y-0.5"></div>

            {/* Main card */}
            <div className="relative bg-white border border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                {children}
            </div>
        </div>
    )
}
