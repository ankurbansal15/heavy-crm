"use client";

import { useState } from "react";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TemplateProps {
  id: string;
  name: string;
  category: string;
  language: string;
  header_type: "media" | "text";
  header_media: File | null;
  body_text: string;
}

interface TemplateFormProps {
  onSubmit: (template: TemplateProps) => void;
  initialTemplate?: TemplateProps | null;
}

export function TemplateForm({ onSubmit, initialTemplate }: TemplateFormProps) {
  const [template, setTemplate] = useState<TemplateProps>(
    initialTemplate || {
      id: '',
      name: "",
      category: "",
      language: "",
      header_type: "text",
      header_media: null,
      body_text: "Hello {{1}}, your order #{{2}} has been confirmed and will be delivered on {{3}}.",
    }
  );

  const [variables, setVariables] = useState({
    "1": "John",
    "2": "12345",
    "3": "Monday",
  });

  const replaceVariables = (text: string) => {
    return text.replace(/\{\{(\d+)\}\}/g, (match, number) => {
      return variables[String(number) as keyof typeof variables] || match;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTemplate({ ...template, header_media: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(template);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="templateName" className="text-sm font-medium mb-1 block">
                Template name
              </label>
              <Input
                id="templateName"
                placeholder="new_template"
                value={template.name}
                onChange={(e) =>
                  setTemplate({ ...template, name: e.target.value })
                }
              />
            </div>

            {/* Category and Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium mb-1 block">
                  Select category
                </label>
                <Select
                  value={template.category}
                  onValueChange={(value) =>
                    setTemplate({ ...template, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Alert/Update" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="language" className="text-sm font-medium mb-1 block">
                  Select Language
                </label>
                <Select
                  value={template.language}
                  onValueChange={(value) =>
                    setTemplate({ ...template, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Header Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="header">
              <AccordionTrigger>Header</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add a title or choose which type of media to use for the
                    header.
                  </p>
                  <div>
                    <label htmlFor="headerType" className="text-sm font-medium mb-1 block">
                      Header type
                    </label>
                    <Select
                      value={template.header_type}
                      onValueChange={(value) =>
                        setTemplate({ ...template, header_type: value })
                      }
                    >
                      <SelectTrigger id="headerType">
                        <SelectValue placeholder="Media" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-[1fr,auto] gap-4">
                    <Input
                      type="file"
                      className="cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <Button type="button">Upload</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div>
            <label htmlFor="bodyText" className="text-sm font-medium mb-1 block">
              Body Text
            </label>
            <Textarea
              id="bodyText"
              value={template.body_text}
              onChange={(e) => setTemplate({ ...template, body_text: e.target.value })}
              rows={6}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:pl-6">
          <div className="sticky top-6">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            <div className="max-w-sm mx-auto">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-[#075E54] text-white p-4">
                  <div className="h-4 w-24 bg-white/20 rounded" />
                </div>
                <div className="bg-[#ECE5DD] p-4 min-h-[400px]">
                  <Card className="max-w-[85%] bg-white">
                    <CardContent className="p-4">
                      {template.header_type === "media" && (
                        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center text-sm text-muted-foreground">
                          {template.header_media
                            ? `Uploaded: ${template.header_media.name}`
                            : "Upload a media to preview"}
                        </div>
                      )}
                      <p className="text-sm">
                        {replaceVariables(template.body_text)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Send for approval</Button>
      </div>
    </form>
  );
}

