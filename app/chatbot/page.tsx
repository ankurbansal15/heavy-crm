"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ChatbotFlow {
  id: string
  name: string
  steps: ChatbotStep[]
}

interface ChatbotStep {
  id: string
  type: "message" | "input" | "condition"
  content: string
  nextStep?: string
}

export default function ChatbotPage() {
  const [chatbotFlows, setChatbotFlows] = useState<ChatbotFlow[]>([])
  const [currentFlow, setCurrentFlow] = useState<ChatbotFlow | null>(null)
  const [newFlowName, setNewFlowName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchChatbotFlows()
    }
  }, [user])

  const fetchChatbotFlows = async () => {
    const { data, error } = await supabase
      .from('chatbot_flows')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching chatbot flows:', error)
      setError("Error fetching chatbot flows. Please try again later.")
    } else {
      setChatbotFlows(data?.map(flow => ({
        ...flow,
        steps: JSON.parse(flow.steps)
      })) || [])
      setError(null)
    }
  }

  const addNewFlow = async () => {
    if (!user || newFlowName.trim() === "") return
    const newFlow: Omit<ChatbotFlow, 'id'> = {
      name: newFlowName,
      steps: []
    }
    const { data, error } = await supabase
      .from('chatbot_flows')
      .insert([{ ...newFlow, user_id: user.id, steps: JSON.stringify(newFlow.steps) }])
      .select()
    if (error) {
      console.error('Error adding chatbot flow:', error)
      setError("Error adding chatbot flow. Please try again later.")
    } else {
      const addedFlow = { ...data[0], steps: JSON.parse(data[0].steps) }
      setChatbotFlows([addedFlow, ...chatbotFlows])
      setCurrentFlow(addedFlow)
      setError(null)
    }
    setNewFlowName("")
  }

  const addStep = (type: "message" | "input" | "condition") => {
    if (!currentFlow) return
    const newStep: ChatbotStep = {
      id: Date.now().toString(),
      type,
      content: ""
    }
    setCurrentFlow({
      ...currentFlow,
      steps: [...currentFlow.steps, newStep]
    })
  }

  const updateStep = (stepId: string, content: string) => {
    if (!currentFlow) return
    const updatedSteps = currentFlow.steps.map(step =>
      step.id === stepId ? { ...step, content } : step
    )
    setCurrentFlow({ ...currentFlow, steps: updatedSteps })
  }

  const removeStep = (stepId: string) => {
    if (!currentFlow) return
    const updatedSteps = currentFlow.steps.filter(step => step.id !== stepId)
    setCurrentFlow({ ...currentFlow, steps: updatedSteps })
  }

  const saveFlow = async () => {
    if (!currentFlow || !user) return
    const { error } = await supabase
      .from('chatbot_flows')
      .update({ ...currentFlow, steps: JSON.stringify(currentFlow.steps) })
      .eq('id', currentFlow.id)
      .eq('user_id', user.id)
    if (error) {
      console.error('Error updating chatbot flow:', error)
      setError("Error saving chatbot flow. Please try again later.")
    } else {
      const updatedFlows = chatbotFlows.map(flow =>
        flow.id === currentFlow.id ? currentFlow : flow
      )
      setChatbotFlows(updatedFlows)
      setError(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Chatbot Management</h1>
      <Tabs defaultValue="flows" className="w-full">
        <TabsList>
          <TabsTrigger value="flows">Chatbot Flows</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="flows">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatbotFlows.map(flow => (
                    <Button
                      key={flow.id}
                      variant={currentFlow?.id === flow.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFlow(flow)}
                    >
                      {flow.name}
                    </Button>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="New flow name"
                      value={newFlowName}
                      onChange={(e) => setNewFlowName(e.target.value)}
                    />
                    <Button onClick={addNewFlow}>Add</Button>
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{currentFlow ? `Edit Flow: ${currentFlow.name}` : "Select a flow"}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentFlow && (
                  <div className="space-y-4">
                    {currentFlow.steps.map(step => (
                      <div key={step.id} className="flex items-start space-x-2">
                        <div className="flex-grow">
                          <Label>{step.type === "message" ? "Message" : step.type === "input" ? "User Input" : "Condition"}</Label>
                          {step.type === "message" ? (
                            <Textarea
                              value={step.content}
                              onChange={(e) => updateStep(step.id, e.target.value)}
                              placeholder={`Enter ${step.type} content`}
                            />
                          ) : (
                            <Input
                              value={step.content}
                              onChange={(e) => updateStep(step.id, e.target.value)}
                              placeholder={step.type === "input" ? "Enter input variable name" : "Enter condition"}
                            />
                          )}
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => removeStep(step.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Button onClick={() => addStep("message")}>Add Message</Button>
                      <Button onClick={() => addStep("input")}>Add Input</Button>
                      <Button onClick={() => addStep("condition")}>Add Condition</Button>
                    </div>
                    <Button onClick={saveFlow} className="w-full">Save Flow</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="Enter the welcome message for your chatbot"
                  />
                </div>
                <div>
                  <Label htmlFor="fallbackMessage">Fallback Message</Label>
                  <Textarea
                    id="fallbackMessage"
                    placeholder="Enter the fallback message for when the chatbot doesn't understand"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" id="enableHumanHandoff" />
                  <Label htmlFor="enableHumanHandoff">Enable human handoff</Label>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

