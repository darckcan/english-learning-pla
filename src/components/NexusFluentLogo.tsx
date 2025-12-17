interface NexusFluentLogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export default function NexusFluentLogo({ className = '', size = 200, showText = true }: NexusFluentLogoProps) {
  return (
    <svg
      width={size}
      height={showText ? size * 0.35 : size}
      viewBox={showText ? "0 0 1050 230" : "0 0 260 230"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M75 50 Q50 50 50 75 L50 155 Q50 180 75 180 L130 180 L130 75 Q130 50 105 50 Z"
        fill="#1E87FF"
        strokeWidth="0"
      />
      <path
        d="M165 125 L230 190 L130 190 Z"
        fill="#FF6347"
        strokeWidth="0"
      />
      {showText && (
        <text
          x="290"
          y="155"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="85"
          fontWeight="700"
          fill="#0A1F3D"
          letterSpacing="-2"
        >
          NexusFluent
        </text>
      )}
    </svg>
  )
}
