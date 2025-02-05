"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Image, Layout, BoxIcon as ButtonIcon, Divide, LayoutGrid, LayoutList, Settings2 } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import { TemplateBlock } from "./template-block";
import { BlockSettings } from "./block-settings";

export interface Block {
  id: string;
  type: "header" | "text" | "button" | "image" | "divider" | "container-horizontal" | "container-vertical";
  content: string;
  children?: Block[];
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    gap?: string;
    justifyContent?: "start" | "center" | "end" | "between" | "around";
    alignItems?: "start" | "center" | "end" | "stretch";
    width?: string;
    height?: string;
  };
}

interface TemplateBuilderProps {
  onSave: (blocks: Block[]) => void;
  initialBlocks?: Block[];
}

const blockTypes = [
  { type: "header", icon: Type, label: "Header" },
  { type: "text", icon: Layout, label: "Text Block" },
  { type: "button", icon: ButtonIcon, label: "Button" },
  { type: "image", icon: Image, label: "Image" },
  { type: "divider", icon: Divide, label: "Divider" },
  { type: "container-horizontal", icon: LayoutGrid, label: "Horizontal Container" },
  { type: "container-vertical", icon: LayoutList, label: "Vertical Container" },
];

export function TemplateBuilder({ onSave, initialBlocks = [] }: TemplateBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"blocks" | "settings">("blocks");

  const addBlock = (type: Block["type"]) => {
    const defaultContent =
      type === "header"
        ? "<h2>Header Text</h2>"
        : type === "text"
        ? "<p>Enter your text here</p>"
        : type === "button"
        ? "Click Me"
        : type === "image"
        ? "https://via.placeholder.com/300x150"
        : "";

    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: defaultContent,
      children: (type === "container-horizontal" || type === "container-vertical") ? [] : undefined,
      styles: {
        backgroundColor: "transparent",
        padding: "4",
        margin: "4",
        borderRadius: "md",
        ...(type === "container-horizontal" || type === "container-vertical") && {
          gap: "4",
          justifyContent: "start",
          alignItems: "start",
          width: "100%",
          height: type === "container-vertical" ? "auto" : "100%",
        },
      },
    };

    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    const removeBlockRecursively = (blocks: Block[]): Block[] => {
      return blocks.filter(block => {
        if (block.id === id) return false;
        if (block.children) {
          block.children = removeBlockRecursively(block.children);
        }
        return true;
      });
    };

    const updatedBlocks = removeBlockRecursively(blocks);
    setBlocks(updatedBlocks);
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
    }
  };

  const updateBlock = (id: string, updatedContent: string, updatedStyles: Partial<Block["styles"]>) => {
    const updateBlockRecursively = (blocks: Block[]): Block[] => {
      return blocks.map(block => {
        if (block.id === id) {
          const updatedBlock = {
            ...block,
            content: updatedContent || block.content,
            styles: { ...block.styles, ...updatedStyles },
          };
          if (selectedBlock?.id === id) {
            setSelectedBlock(updatedBlock);
          }
          return updatedBlock;
        }
        if (block.children) {
          return {
            ...block,
            children: updateBlockRecursively(block.children),
          };
        }
        return block;
      });
    };

    setBlocks(updateBlockRecursively(blocks));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorder = (list: Block[], startIndex: number, endIndex: number): Block[] => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const findContainerAndReorder = (blocks: Block[], sourceId: string, destinationId: string, sourceIndex: number, destinationIndex: number): Block[] => {
      return blocks.map(block => {
        if (block.children) {
          if (block.id === sourceId && block.id === destinationId) {
            return {
              ...block,
              children: reorder(block.children, sourceIndex, destinationIndex),
            };
          }
          return {
            ...block,
            children: findContainerAndReorder(block.children, sourceId, destinationId, sourceIndex, destinationIndex),
          };
        }
        return block;
      });
    };

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    if (sourceId === destinationId) {
      if (sourceId === "template") {
        setBlocks(reorder(blocks, result.source.index, result.destination.index));
      } else {
        setBlocks(findContainerAndReorder(
          blocks,
          sourceId,
          destinationId,
          result.source.index,
          result.destination.index
        ));
      }
    }
  };

  const renderBlocks = (blocks: Block[], containerId?: string) => {
    return (
      <Droppable droppableId={containerId || "template"}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={containerId ? "space-y-4" : "space-y-4 p-4"}
          >
            {blocks.map((block, index) => (
              <TemplateBlock
                key={block.id}
                {...block}
                index={index}
                onRemove={removeBlock}
                onEdit={updateBlock}
                onSelect={() => setSelectedBlock(block)}
                isSelected={selectedBlock?.id === block.id}
              >
                {block.children && renderBlocks(block.children, block.id)}
              </TemplateBlock>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="grid grid-cols-[300px,1fr] gap-4 min-h-[600px]">
      <Card className="p-4">
        <Tabs value={sidebarTab} onValueChange={(value) => setSidebarTab(value as "blocks" | "settings")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks">
              <Layout className="w-4 h-4 mr-2" />
              Blocks
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="blocks" className="space-y-2">
            {blockTypes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addBlock(type)}
                className="w-full flex justify-start items-center"
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </TabsContent>
          
          <TabsContent value="settings">
            {selectedBlock ? (
              <BlockSettings
                block={selectedBlock}
                onChange={(styles) => updateBlock(selectedBlock.id, selectedBlock.content, styles)}
              />
            ) : (
              <div className="text-center text-muted-foreground p-4">
                Select a block to view its settings
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="edit">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="flex-1">
            <Card className="flex-1">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <DragDropContext onDragEnd={handleDragEnd}>
                  {renderBlocks(blocks)}
                </DragDropContext>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <Card className="flex-1 p-4">
              <div className="space-y-4">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="preview-block"
                    style={{
                      backgroundColor: block.styles.backgroundColor,
                      padding: `${block.styles.padding}px`,
                      margin: `${block.styles.margin}px`,
                      borderRadius: block.styles.borderRadius === 'none' ? '0' :
                                block.styles.borderRadius === 'sm' ? '0.125rem' :
                                block.styles.borderRadius === 'md' ? '0.375rem' :
                                block.styles.borderRadius === 'lg' ? '0.5rem' :
                                block.styles.borderRadius === 'full' ? '9999px' : '0.375rem',
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: block.content }} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => onSave(blocks)}>Save Template</Button>
        </div>
      </div>
    </div>
  );
}

