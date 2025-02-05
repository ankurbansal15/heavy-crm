"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if we're at the root templates page
    if (window.location.pathname === "/templates") {
      router.push("/templates/email")
    }
  }, [router])

  return children
}

