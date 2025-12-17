interface NexusFluentLogoProps {
  className?: string
  size?: number
}

export default function NexusFluentLogo({ className = '', size = 200 }: NexusFluentLogoProps) {
  return (
    <svg
      width={size}
      height={size * 0.3}
      viewBox="0 0 1000 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M120 60 Q60 60 60 120 Q60 180 120 180 L120 140 L140 160 L140 60 Z"
        fill="#1E90FF"
      />
      <path
        d="M90 110 L140 160 L180 120 L130 70 Z"
        fill="#FF6347"
      />
      <text
        x="220"
        y="155"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="100"
        fontWeight="600"
        fill="#0A1F3D"
      >
        NexusFluent
      </text>
    </svg>
  )
}
