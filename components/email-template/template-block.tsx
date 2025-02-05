'use client'

import { Button } from "@/components/ui/button"
import { RichTextEditor } from "./rich-text-editor"
import { Draggable } from "react-beautiful-dnd"
import { X, GripVertical } from 'lucide-react'
import { Block } from "./template-builder"
import { cn } from "@/lib/utils"

interface TemplateBlockProps extends Block {
  index: number;
  onRemove: (id: string) => void;
  onEdit: (id: string, content: string, styles?: Block["styles"]) => void;
  onSelect: () => void;
  isSelected: boolean;
  children?: React.ReactNode;
}

export function TemplateBlock({
  id,
  index,
  type,
  content,
  styles = {},
  onRemove,
  onEdit,
  onSelect,
  isSelected,
  children
}: TemplateBlockProps) {
  const isContainer = type === "container-horizontal" || type === "container-vertical";

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "relative group bg-white dark:bg-gray-800 rounded-lg border p-4 mb-2",
            isSelected && "ring-2 ring-primary",
            isContainer && type === "container-horizontal" && "flex flex-row",
            isContainer && type === "container-vertical" && "flex flex-col"
          )}
          style={{
            ...styles,
            ...(isContainer && {
              gap: `${styles.gap}px`,
              justifyContent: styles.justifyContent,
              alignItems: styles.alignItems,
              width: styles.width,
              height: styles.height,
            })
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <div
            {...provided.dragHandleProps}
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className={cn(
            "pl-8 pr-8 w-full",
            isContainer && "min-h-[100px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded p-2"
          )}>
            {!isContainer && (
              type === 'header' || type === 'text' ? (
                <RichTextEditor
                  content={content}
                  onChange={(newContent) => onEdit(id, newContent, styles)}
                  minimal={type === 'header'}
                  placeholder={type === 'header' ? "Enter header text..." : "Enter your content here..."}
                />
              ) : type === 'button' ? (
                <div className="flex items-center gap-2">
                  <RichTextEditor
                    content={content}
                    onChange={(newContent) => onEdit(id, newContent, styles)}
                    minimal={true}
                    placeholder="Button text..."
                  />
                  <Button variant="secondary" className="pointer-events-none">
                    {content || "Button"}
                  </Button>
                </div>
              ) : type === 'image' ? (
                <div className="space-y-2">
                  <RichTextEditor
                    content={content}
                    onChange={(newContent) => onEdit(id, newContent, styles)}
                    minimal={true}
                    placeholder="Image URL..."
                  />
                  {content && (
                    <img
                      src={content}
                      alt="Template"
                      className="max-w-full h-auto rounded"
                    />
                  )}
                </div>
              ) : type === 'divider' ? (
                <div className="py-2">
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                </div>
              ) : null
            )}
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
}

