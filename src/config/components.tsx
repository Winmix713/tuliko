import React from 'react'

export interface ComponentData {
  description: string
  component?: React.ComponentType
  code: string
  cssCode?: string
}

export type ComponentCategory = Record<string, ComponentData>

// Defining proper interfaces for components
interface ButtonProps {}
interface CardProps {}
interface InputProps {}
interface CheckboxProps {}

// Example Button Component
const Button: React.FC<ButtonProps> = () => {
  return (
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
      Button
    </button>
  )
}

// Example Card Component
const Card: React.FC<CardProps> = () => {
  return (
    <div className="w-72 p-4 rounded-lg border border-border bg-card shadow-sm">
      <h3 className="font-medium mb-2">Card Title</h3>
      <p className="text-sm text-muted-foreground">This is a sample card component with some content.</p>
    </div>
  )
}

// Example Input Component
const Input: React.FC<InputProps> = () => {
  return (
    <input
      type="text"
      placeholder="Enter text..."
      className="px-3 py-2 rounded-md border border-input bg-background focus:border-primary focus:outline-none w-64"
    />
  )
}

// Example Checkbox Component
const Checkbox: React.FC<CheckboxProps> = () => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 accent-primary" />
      <span>Checkbox</span>
    </label>
  )
}

export const components: Record<string, ComponentCategory> = {
  'Basic Components': {
    'Button': {
      description: 'Interactive button element',
      component: Button,
      code: `export const Button = () => {
  return (
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
      Button
    </button>
  )
}`
    },
    'Card': {
      description: 'Container for displaying content',
      component: Card,
      code: `export const Card = () => {
  return (
    <div className="w-72 p-4 rounded-lg border border-border bg-card shadow-sm">
      <h3 className="font-medium mb-2">Card Title</h3>
      <p className="text-sm text-muted-foreground">This is a sample card component with some content.</p>
    </div>
  )
}`
    },
  },
  'Form Components': {
    'Input': {
      description: 'Text input field',
      component: Input,
      code: `export const Input = () => {
  return (
    <input
      type="text"
      placeholder="Enter text..."
      className="px-3 py-2 rounded-md border border-input bg-background focus:border-primary focus:outline-none w-64"
    />
  )
}`
    },
    'Checkbox': {
      description: 'Interactive checkbox element',
      component: Checkbox,
      code: `export const Checkbox = () => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 accent-primary" />
      <span>Checkbox</span>
    </label>
  )
}`
    },
  }
}