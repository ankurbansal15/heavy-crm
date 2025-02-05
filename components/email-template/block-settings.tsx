import { Block } from "./template-builder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlockSettingsProps {
  block: Block;
  onChange: (styles: Partial<Block["styles"]>) => void;
}

const backgroundColors = [
  { name: "None", value: "transparent" },
  { name: "Primary", value: "hsl(var(--primary))" },
  { name: "Secondary", value: "hsl(var(--secondary))" },
  { name: "Muted", value: "hsl(var(--muted))" },
  { name: "Accent", value: "hsl(var(--accent))" },
];

const spacingOptions = ["0", "2", "4", "6", "8", "12", "16", "20"];
const radiusOptions = ["none", "sm", "md", "lg", "full"];
const alignmentOptions = ["start", "center", "end", "stretch"];
const justifyOptions = ["start", "center", "end", "between", "around"];

export function BlockSettings({ block, onChange }: BlockSettingsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 p-1">
        <div className="space-y-2">
          <Label>Background Color</Label>
          <Select
            value={block.styles.backgroundColor || "transparent"}
            onValueChange={(value) => onChange({ backgroundColor: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {backgroundColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Padding</Label>
          <Select
            value={block.styles.padding || "4"}
            onValueChange={(value) => onChange({ padding: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              {spacingOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Margin</Label>
          <Select
            value={block.styles.margin || "4"}
            onValueChange={(value) => onChange({ margin: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select margin" />
            </SelectTrigger>
            <SelectContent>
              {spacingOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Select
            value={block.styles.borderRadius || "md"}
            onValueChange={(value) => onChange({ borderRadius: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(block.type === "container-horizontal" || block.type === "container-vertical") && (
          <>
            <div className="space-y-2">
              <Label>Gap</Label>
              <Select
                value={block.styles.gap || "4"}
                onValueChange={(value) => onChange({ gap: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gap" />
                </SelectTrigger>
                <SelectContent>
                  {spacingOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Justify Content</Label>
              <Select
                value={block.styles.justifyContent || "start"}
                onValueChange={(value) => onChange({ justifyContent: value as Block["styles"]["justifyContent"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select justification" />
                </SelectTrigger>
                <SelectContent>
                  {justifyOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Align Items</Label>
              <Select
                value={block.styles.alignItems || "start"}
                onValueChange={(value) => onChange({ alignItems: value as Block["styles"]["alignItems"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                type="text"
                value={block.styles.width || "100%"}
                onChange={(e) => onChange({ width: e.target.value })}
                placeholder="e.g., 100%, 300px"
              />
            </div>

            {block.type === "container-vertical" && (
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="text"
                  value={block.styles.height || "auto"}
                  onChange={(e) => onChange({ height: e.target.value })}
                  placeholder="e.g., auto, 300px"
                />
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

