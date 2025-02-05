import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface SearchResult {
  href: string
  label: string
}

interface SearchPopupProps {
  results: SearchResult[]
  isOpen: boolean
  onClose: () => void
}

export function SearchPopup({ results, isOpen, onClose }: SearchPopupProps) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div ref={ref} className="absolute top-full left-0 right-0 z-50 mt-2">
      <Command className="rounded-lg border shadow-md">
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {results.map((result) => (
              <CommandItem
                key={result.href}
                onSelect={() => {
                  router.push(result.href)
                  onClose()
                }}
              >
                {result.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

