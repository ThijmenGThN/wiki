export default function GeometricPattern() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 opacity-5">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 opacity-5">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>
        </div>
    )
}
