import { useState } from "react"
import { Palette, Copy, Check } from "lucide-react"
import { HexColorPicker } from "react-colorful"

interface ColorSelectorProps {
    value: string
    onChange: (color: string) => void
}

const presetColors = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
    "#3B82F6",
    "#64748B",
]

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
    const [copied, setCopied] = useState(false)

    const copyColor = async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
    }

    return (
        <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2">
                <Palette className="h-3.5 w-3.5" />
                Color
            </label>
            <div className="flex items-center gap-2">
                <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: value }}
                />

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-xs font-mono bg-muted px-2 py-1 rounded border w-20"
                />

                <button
                    type="button"
                    onClick={copyColor}
                    className="p-1 rounded border hover:bg-muted transition"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>
            <div className="flex justify-center">
                <div className="scale-90 origin-top">
                    <HexColorPicker color={value} onChange={onChange} />
                </div>
            </div>
            <div className="grid grid-cols-10 gap-1">
                {presetColors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        className={`w-5 h-5 rounded border hover:scale-110 transition ${value === color ? "ring-1 ring-primary" : ""
                            }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    )
}