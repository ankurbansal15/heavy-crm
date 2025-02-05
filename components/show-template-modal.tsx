import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Template } from "@/types/template"

interface ShowTemplateModalProps {
  template: Template;
  onClose: () => void;
}

export function ShowTemplateModal({ template, onClose }: ShowTemplateModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>
            Category: {template.category}, Language: {template.language}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Header Type:</span>
            <span className="col-span-3">{template.headerType}</span>
          </div>
          {template.headerMedia && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Header Media:</span>
              <span className="col-span-3">{template.headerMedia}</span>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Body Text:</span>
            <span className="col-span-3">{template.bodyText}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

