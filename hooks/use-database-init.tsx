'use client'

import { useEffect, useState } from 'react'
import { ensureDatabaseReady } from '@/lib/database-init'

interface DatabaseStatus {
  isReady: boolean
  isLoading: boolean
  error: string | null
}

export function useDatabaseInit(): DatabaseStatus {
  const [status, setStatus] = useState<DatabaseStatus>({
    isReady: false,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setStatus({ isReady: false, isLoading: true, error: null })
        await ensureDatabaseReady()
        setStatus({ isReady: true, isLoading: false, error: null })
      } catch (error) {
        console.error('Database initialization failed:', error)
        setStatus({ 
          isReady: false, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Database initialization failed'
        })
      }
    }

    initDatabase()
  }, [])

  return status
}
