interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

export function Slider({ value, onChange, min, max, step }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}
