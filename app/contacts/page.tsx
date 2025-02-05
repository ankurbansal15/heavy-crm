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
import { PlusCircle, ListPlus, Filter } from 'lucide-react'
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
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <Dialog open={newListDialog} onOpenChange={setNewListDialog}>
          <DialogTrigger asChild>
            <Button>
              <ListPlus className="mr-2 h-4 w-4" />
              Create Contact List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contact List</DialogTitle>
              <DialogDescription>
                Create a new list to organize your contacts
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newList.description}
                  onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createContactList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-red-500 mt-2 mb-4">{error}</p>}

      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <Input
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
          <Input
            placeholder="Group"
            value={newContact.contact_group}
            onChange={(e) => setNewContact({ ...newContact, contact_group: e.target.value })}
          />
          <Select
            value={selectedLists.length > 0 ? selectedLists.join(",") : "placeholder"}
            onValueChange={(value) => setSelectedLists(value === "placeholder" ? [] : value.split(","))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select lists" />
            </SelectTrigger>
            <SelectContent>
              {contactLists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addContact}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <FileImport onImport={handleImport} />
          <Button onClick={handleExport}>Export Contacts</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={filterByList || "placeholder"} onValueChange={(value) => setFilterByList(value === "placeholder" ? "" : value)}>
            <SelectTrigger className="w-[200px]">
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
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">Import/Export Guidelines</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import/Export Guidelines</DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">CSV Format</h3>
                  <p>Your CSV file should have the following columns:</p>
                  <ul className="list-disc list-inside">
                    <li>name: The contact's full name</li>
                    <li>phone: The contact's phone number (including country code)</li>
                    <li>email: The contact's email address</li>
                    <li>contact_group: The group this contact belongs to</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                  <ul className="list-disc list-inside">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Lists</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.contact_group}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {contact.list_ids?.map((listId) => {
                    const list = contactLists.find(l => l.id === listId)
                    return list ? (
                      <Badge key={listId} variant="secondary">
                        {list.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

