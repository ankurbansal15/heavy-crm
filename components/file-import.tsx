import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileImportProps {
  onImport: (data: any[]) => void
}

export function FileImport({ onImport }: FileImportProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      let data

      if (fileExtension === 'csv') {
        const text = await file.text()
        data = parseCSV(text)
      } else if (fileExtension === 'xlsx') {
        const xlsx = await import('xlsx')
        const arrayBuffer = await file.arrayBuffer()
        const workbook = xlsx.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        data = xlsx.utils.sheet_to_json(sheet)
      } else {
        throw new Error('Unsupported file format. Please use CSV or XLSX.')
      }

      onImport(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while importing the file.')
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n')
    const headers = lines[0].split(',')
    return lines.slice(1).map(line => {
      const values = line.split(',')
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim()
        return obj
      }, {} as Record<string, string>)
    })
  }

  return (
    <div>
      <Label htmlFor="file-upload">Import Contacts (CSV or XLSX)</Label>
      <Input
        id="file-upload"
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
      />
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

