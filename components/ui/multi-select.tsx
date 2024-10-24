'use client'

import React, { useState } from 'react'
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps<T extends object> {
  options?: T[]  // Rendez cette prop optionnelle
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
  className?: string
  createable?: boolean
}

export function MultiSelect<T extends object>({
  options = [],  // Valeur par défaut : tableau vide
  selected,
  onChange,
  placeholder,
  className,
  createable = true,  // Par défaut, on permet la création de nouvelles options
}: MultiSelectProps<T>) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      if (createable || options.some(option => option.toString() === inputValue)) {
        onChange([...selected, inputValue])
        setInputValue("")
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange(selected.filter(t => t !== tag))
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {selected.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-4 w-4 p-0"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        list="options"
      />
      <datalist id="options">
        {options.map((option, index) => (
          <option key={index} value={option.toString()} />
        ))}
      </datalist>
    </div>
  )
}
