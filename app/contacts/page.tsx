"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileImport } from "@/components/file-import"
import saveAs from 'file-saver'
import * as XLSX from 'xlsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ListPlus, Filter, Search, Download, Upload, Users, Mail, Phone, UserCheck } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/lib/supabase'

interface Contact {
  id?: string
  name: string
  phone: string
  email: string
  contact_group: string
  list_ids: string[]
}

interface ContactList {
  id: string
  name: string
  description: string
  created_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactLists, setContactLists] = useState<ContactList[]>([])
  const [newContact, setNewContact] = useState<Contact>({ 
    name: "", 
    phone: "", 
    email: "", 
    contact_group: "",
    list_ids: []
  })
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [filterByList, setFilterByList] = useState<string>("")
  const [newListDialog, setNewListDialog] = useState(false)
  const [newList, setNewList] = useState({ name: "", description: "" })
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchContacts()
      fetchContactLists()
    }
  }, [user])

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching contacts:', error)
      setError("Error fetching contacts. Please try again.")
    } else {
      setContacts(data || [])
      setError(null)
    }
  }

  const fetchContactLists = async () => {
    const { data, error } = await supabase
      .from('contact_lists')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching contact lists:', error)
      setError("Error fetching contact lists. Please try again.")
    } else {
      setContactLists(data || [])
      setError(null)
    }
  }

  const addContact = async () => {
    if (!user) return
    setError(null)
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ 
        ...newContact, 
        user_id: user.id,
        list_ids: selectedLists 
      }])
      .select()
    if (error) {
      console.error('Error adding contact:', error)
      setError("Error adding contact. Please try again.")
    } else {
      setContacts([data[0], ...contacts])
      setNewContact({ name: "", phone: "", email: "", contact_group: "", list_ids: [] })
      setSelectedLists([])
      setError(null)
    }
  }

  const createContactList = async () => {
    if (!user || !newList.name) return
    setError(null)
    const { data, error } = await supabase
      .from('contact_lists')
      .insert([{ 
        ...newList,
        user_id: user.id 
      }])
      .select()
    if (error) {
      console.error('Error creating contact list:', error)
      setError("Error creating contact list. Please try again.")
    } else {
      setContactLists([data[0], ...contactLists])
      setNewList({ name: "", description: "" })
      setNewListDialog(false)
      setError(null)
    }
  }

  const handleImport = async (importedContacts: Contact[]) => {
    if (!user) return
    setError(null)
    const { data, error } = await supabase
      .from('contacts')
      .insert(importedContacts.map(contact => ({ 
        ...contact, 
        user_id: user.id,
        list_ids: selectedLists 
      })))
      .select()
    if (error) {
      console.error('Error importing contacts:', error)
      setError("Error importing contacts. Please try again.")
    } else {
      setContacts([...data, ...contacts])
      setError(null)
    }
  }

  const handleExport = () => {
    const contactsToExport = filterByList 
      ? contacts.filter(contact => contact.list_ids.includes(filterByList))
      : contacts
    
    const worksheet = XLSX.utils.json_to_sheet(contactsToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, 'contacts.xlsx')
  }

  const filteredContacts = filterByList
    ? contacts.filter(contact => contact.list_ids.includes(filterByList))
    : contacts

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                Contact Management
              </h1>
              <p className="text-body text-muted-foreground">
                Organize and manage your contacts with powerful tools
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <Users className="w-4 h-4" />
                {contacts.length} CONTACTS TOTAL
              </div>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Dialog open={newListDialog} onOpenChange={setNewListDialog}>
                <DialogTrigger asChild>
                  <Button className="btn-primary hover-lift">
                    <ListPlus className="mr-2 h-4 w-4" />
                    Create Contact List
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-0 shadow-2xl">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-heading-4">Create New Contact List</DialogTitle>
                    <DialogDescription className="text-body-small">
                      Create a new list to organize your contacts efficiently
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">List Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter list name..."
                        value={newList.name}
                        onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                        className="input-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Input
                        id="description"
                        placeholder="Enter description..."
                        value={newList.description}
                        onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                        className="input-primary"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={createContactList} className="btn-primary">
                      Create List
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 -mt-4 mb-8">
        <div className="grid gap-6 md:grid-cols-4 animate-slide-up">
          <Card className="card-elevated hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Total Contacts</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{contacts.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">Contact Lists</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{contactLists.length}</p>
                </div>
                <ListPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{contacts.filter(c => c.email).length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">+{Math.floor(contacts.length * 0.15)}</p>
                </div>
                <PlusCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="px-8 mb-6">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slide-in-left">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 pb-8">
        <Card className="card-elevated glass-effect border-0 shadow-xl animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-heading-4">Contact Directory</CardTitle>
                <CardDescription className="text-body-small">
                  Add, organize, and manage your contacts
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <FileImport 
                  onImport={(data) => {
                    setContacts([...contacts, ...data])
                  }}
                />
                <Button onClick={handleExport} variant="outline" className="hover-lift">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Add Contact Form */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/50">
              <h3 className="text-lg font-semibold">Add New Contact</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name</Label>
                  <Input
                    placeholder="Full name..."
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="input-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    placeholder="Phone number..."
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="input-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    placeholder="Email address..."
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="input-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Group</Label>
                  <Input
                    placeholder="Contact group..."
                    value={newContact.contact_group}
                    onChange={(e) => setNewContact({ ...newContact, contact_group: e.target.value })}
                    className="input-primary"
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-medium">Assign to Lists</Label>
                  <Select
                    value={selectedLists.length > 0 ? selectedLists.join(",") : "placeholder"}
                    onValueChange={(value) => setSelectedLists(value === "placeholder" ? [] : value.split(","))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact lists..." />
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addContact} className="btn-primary hover-lift">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </div>
            
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border border-border/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterByList || "placeholder"} onValueChange={(value) => setFilterByList(value === "placeholder" ? "" : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">All Contacts</SelectItem>
                    {contactLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hover-lift">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hover-lift">
                      <Upload className="mr-2 h-4 w-4" />
                      Guidelines
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass-effect border-0 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-heading-4">Import/Export Guidelines</DialogTitle>
                      <DialogDescription>
                        <div className="space-y-6 mt-4">
                          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl">
                            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">CSV Format</h3>
                            <p className="mb-3 text-blue-800 dark:text-blue-200">Your CSV file should have the following columns:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                              <li>name: The contact's full name</li>
                              <li>phone: The contact's phone number (including country code)</li>
                              <li>email: The contact's email address</li>
                              <li>contact_group: The group this contact belongs to</li>
                            </ul>
                          </div>
                          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl">
                            <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">Best Practices</h3>
                            <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                              <li>Ensure all required fields are filled for each contact</li>
                              <li>Use consistent formatting for phone numbers</li>
                              <li>Group names should be consistent</li>
                              <li>Check for duplicates before importing</li>
                            </ul>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          {/* Contacts Table */}
          <CardContent className="p-0">
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Group</TableHead>
                    <TableHead className="font-semibold">Lists</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                      <TableRow 
                        key={contact.id} 
                        className="hover:bg-muted/30 transition-colors animate-fade-in" 
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center">
                              {contact.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            {contact.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {contact.email || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {contact.contact_group || 'Unassigned'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contact.list_ids?.length > 0 ? (
                              contact.list_ids.map((listId) => {
                                const list = contactLists.find(l => l.id === listId)
                                return list ? (
                                  <Badge key={listId} variant="secondary" className="text-xs">
                                    {list.name}
                                  </Badge>
                                ) : null
                              })
                            ) : (
                              <span className="text-muted-foreground text-sm">No lists</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <Users className="w-12 h-12 opacity-50" />
                          <div>
                            <p className="text-lg font-medium">No contacts found</p>
                            <p className="text-sm">Add your first contact to get started</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

