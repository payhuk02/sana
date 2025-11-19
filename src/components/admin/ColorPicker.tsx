import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface ColorPickerProps {
  label: string;
  value: string; // HSL format: "262.1 83.3% 57.8%"
  onChange: (value: string) => void;
  description?: string;
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  // Convert HSL string to hex for color input
  const hslToHex = (hsl: string): string => {
    // Default to black if value is undefined
    if (!hsl) return '#000000';
    
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const hDecimal = h / 360;
    const sDecimal = s / 100;
    const lDecimal = l / 100;

    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs((hDecimal * 6) % 2 - 1));
    const m = lDecimal - c / 2;

    let r = 0, g = 0, b = 0;
    if (hDecimal < 1/6) { r = c; g = x; b = 0; }
    else if (hDecimal < 2/6) { r = x; g = c; b = 0; }
    else if (hDecimal < 3/6) { r = 0; g = c; b = x; }
    else if (hDecimal < 4/6) { r = 0; g = x; b = c; }
    else if (hDecimal < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert hex to HSL string
  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
  };

  // Use default color if value is undefined
  const safeValue = value || '0 0% 0%';
  const [hexColor, setHexColor] = useState(hslToHex(safeValue));

  useEffect(() => {
    setHexColor(hslToHex(safeValue));
  }, [safeValue]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexColor(newHex);
    onChange(hexToHsl(newHex));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={hexColor}
          onChange={handleColorChange}
          className="h-10 w-20 rounded-md border border-input cursor-pointer"
        />
        <Input
          value={hexColor}
          onChange={handleColorChange}
          className="flex-1"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
