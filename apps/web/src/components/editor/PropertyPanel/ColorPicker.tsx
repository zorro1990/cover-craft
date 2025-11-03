import { useState } from 'react'
import { Input } from './Input'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  placeholder?: string
}

export function ColorPicker({ value, onChange, placeholder }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
      />
      <Input
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  )
}
