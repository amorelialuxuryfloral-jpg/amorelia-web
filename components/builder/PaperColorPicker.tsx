import { Check } from "lucide-react";

/**
 * Wrapping-paper color picker — 1:1 port of the SPA's PaperColorPicker.
 * Images live under /public/assets (same webp files as the SPA bundle).
 */

export interface PaperColorOption {
  name: string;
  image: string;
}

export const paperColorOptions: PaperColorOption[] = [
  { name: "White", image: "/assets/paper-blanco.webp" },
  { name: "Light Pink", image: "/assets/paper-rosa-light.webp" },
  { name: "Beige", image: "/assets/paper-beige.webp" },
  { name: "Mauve", image: "/assets/paper-morado.webp" },
  { name: "Blue", image: "/assets/paper-azul.webp" },
  { name: "Black", image: "/assets/paper-negro.webp" },
];

interface PaperColorPickerProps {
  selected: string;
  onChange: (name: string) => void;
}

const PaperColorPicker = ({ selected, onChange }: PaperColorPickerProps) => {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {paperColorOptions.map((paper) => (
          <button
            key={paper.name}
            type="button"
            onClick={() => onChange(paper.name)}
            className={`relative flex flex-col items-center gap-2 p-1.5 rounded-lg border-2 transition-all ${
              selected === paper.name
                ? "border-primary scale-105 shadow-md"
                : "border-transparent hover:border-primary/30 hover:scale-105"
            }`}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={paper.image}
                alt={`${paper.name} paper`}
                width={64}
                height={64}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-body text-foreground">{paper.name}</span>
            {selected === paper.name && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaperColorPicker;
