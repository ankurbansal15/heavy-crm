'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw, Database, AlertCircle } from 'lucide-react'
import { checkTablesExist, initializeDatabase } from '@/lib/database-init'

export function DatabaseStatus() {
  const [checking, setChecking] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [status, setStatus] = useState<{
    exists: boolean
    missingTables: string[]
    lastChecked?: Date
  } | null>(null)

  const handleCheck = async () => {
    setChecking(true)
    try {
      const result = await checkTablesExist()
      setStatus({
        ...result,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Error checking database status:', error)
    } finally {
      setChecking(false)
    }
  }

  const handleInitialize = async () => {
    setInitializing(true)
    try {
      await initializeDatabase()
      // Re-check status after initialization
      const result = await checkTablesExist()
      setStatus({
        ...result,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Error initializing database:', error)
    } finally {
      setInitializing(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>
          Check and manage your Supabase database tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleCheck} 
            disabled={checking}
            variant="outline"
          >
            {checking ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Check Status
          </Button>
          
          {status && !status.exists && (
            <Button 
              onClick={handleInitialize} 
              disabled={initializing}
            >
              {initializing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Initialize Database
            </Button>
          )}
        </div>

        {status && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {status.exists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {status.exists 
                  ? 'All required tables exist' 
                  : `${status.missingTables.length} tables missing`
                }
              </span>
            </div>

            {status.lastChecked && (
              <p className="text-sm text-muted-foreground">
                Last checked: {status.lastChecked.toLocaleString()}
              </p>
            )}

            {!status.exists && status.missingTables.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Missing Tables:
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {status.missingTables.map((table) => (
                    <span 
                      key={table} 
                      className="text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                    >
                      {table}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Manual Setup Instructions:
                  </h5>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>1. Go to your Supabase project dashboard</li>
                    <li>2. Navigate to the SQL Editor</li>
                    <li>3. Copy the contents of <code>database-setup.sql</code></li>
                    <li>4. Paste and execute the SQL script</li>
                    <li>5. Click "Check Status" again to verify</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
