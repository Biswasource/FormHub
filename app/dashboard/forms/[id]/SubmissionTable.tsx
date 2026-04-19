"use client"

import { useState } from "react"
import { RiDeleteBin7Line, RiEditLine, RiLoader4Line } from "@remixicon/react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SubmissionTableProps {
  initialSubmissions: any[]
  dataFields: any[]
  formId: string
}

export default function SubmissionTable({ initialSubmissions, dataFields, formId }: SubmissionTableProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [editingSubmission, setEditingSubmission] = useState<any>(null)
  const [editFormAnswers, setEditFormAnswers] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleEditClick = (submission: any) => {
    setEditingSubmission(submission)
    setEditFormAnswers({ ...submission.answers })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setTargetId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!targetId) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/submissions/${targetId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== targetId))
        setIsDeleteDialogOpen(false)
        router.refresh()
      } else {
        alert("Failed to delete submission")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setIsDeleting(null)
      setIsDeleting(false)
      setTargetId(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingSubmission) return

    setIsSaving(true)
    try {
      const res = await fetch(`/api/submissions/${editingSubmission._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: editFormAnswers }),
      })

      if (res.ok) {
        setSubmissions(prev => prev.map(s => 
          s._id === editingSubmission._id ? { ...s, answers: editFormAnswers } : s
        ))
        setIsEditDialogOpen(false)
        router.refresh()
      } else {
        alert("Failed to update submission")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#111113]">
                <th className="p-4 font-semibold whitespace-nowrap min-w-[200px]">Submitted Date</th>
                {dataFields.map((field: any) => (
                  <th key={field.id} className="p-4 font-semibold whitespace-nowrap min-w-[200px]">
                    {field.label || field.type.toUpperCase()}
                  </th>
                ))}
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e1e21]">
              {submissions.map((sub: any) => (
                <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-[#18181b]/50 transition-colors group">
                  <td className="p-4 text-gray-500 dark:text-[#a1a1aa] whitespace-nowrap">
                    {new Date(sub.submittedAt).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </td>
                  {dataFields.map((field: any) => {
                    let val = sub.answers[field.id]
                    if (val === true || val === 'checked') val = "Yes"
                    if (val === false) val = "No"

                    return (
                      <td key={field.id} className="p-4 whitespace-pre-wrap max-w-[300px] truncate group-hover:text-green-700 dark:group-hover:text-[#ccff00] transition-colors">
                        {val !== undefined && val !== null && val !== "" ? String(val) : <span className="text-gray-400 dark:text-[#52525b] italic">Empty</span>}
                      </td>
                    )
                  })}
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(sub)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Edit Response"
                      >
                        <RiEditLine className="w-[18px] h-[18px]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(sub._id)}
                        disabled={isDeleting && targetId === sub._id}
                        className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete Response"
                      >
                        {isDeleting && targetId === sub._id ? (
                          <RiLoader4Line className="w-[18px] h-[18px] animate-spin" />
                        ) : (
                          <RiDeleteBin7Line className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#27272a]">
          <DialogHeader>
            <DialogTitle>Delete Response</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this response? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4 font-bold">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="dark:border-[#27272a] dark:hover:bg-[#18181b]">
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 border-none"
            >
              {isDeleting ? <RiLoader4Line className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#27272a]">
          <DialogHeader>
            <DialogTitle>Edit Response</DialogTitle>
            <DialogDescription>
              Modify the captured data for this submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            {dataFields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  {field.label || field.type.toUpperCase()}
                </Label>
                <Input
                  id={field.id}
                  value={editFormAnswers[field.id] || ""}
                  onChange={(e) => setEditFormAnswers({ ...editFormAnswers, [field.id]: e.target.value })}
                  className="bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-[#27272a] focus-visible:ring-[#ccff00]"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0 font-bold">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="dark:border-[#27272a] dark:hover:bg-[#18181b]">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={isSaving}
              className="bg-[#ccff00] text-black hover:bg-[#bdeb02] border-none"
            >
              {isSaving ? <RiLoader4Line className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
