'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface EmbeddableFormProps {
  platform: string
}

export function EmbeddableForm({ platform }: EmbeddableFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          email: '',
          subject: '',
          description: '',
        })
      }, 3000)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Ticket Submitted!
        </h2>
        <p className="text-muted-foreground">
          We&apos;ve received your support request. Our team will get back to you
          shortly at <span className="font-semibold text-foreground">{formData.email}</span>.
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          Redirecting in 3 seconds...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Context Info */}
      <div className="rounded-lg bg-secondary/50 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Platform
          </p>
          <p className="text-sm font-semibold text-foreground">{platform}</p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium">
          Subject
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="Describe your issue briefly"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Please provide as much detail as possible about your issue..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-[120px] resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </Button>

      {/* Footer Info */}
      <p className="text-xs text-muted-foreground text-center">
        Expected response time: 2-4 hours
      </p>
    </form>
  )
}
