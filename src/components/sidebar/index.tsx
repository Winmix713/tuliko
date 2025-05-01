import { useState } from 'react'
import { components, ComponentCategory } from '../../config/components'
import ThemeSwitcher from '../theme-switcher'
import { useMobile } from '../../hooks'

interface SidebarProps {
  className?: string
  selectedComponent: string | null
  onSelectComponent: (component: string) => void
}

export default function Sidebar({ 
  className = '', 
  selectedComponent, 
  onSelectComponent 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Basic Components': true,
    'Form Components': true,
  })
  const isMobile = useMobile()

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filteredComponents = Object.entries(components).reduce<Record<string, ComponentCategory>>(
    (acc, [category, components]) => {
      const filtered = Object.entries(components).filter(([name]) => 
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (filtered.length > 0) {
        acc[category] = Object.fromEntries(filtered)
      }

      return acc
    },
    {}
  )

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Component Library</h1>
        <div className="flex items-center space-x-2">
          <a href="https://github.com/Winmix713/gabakiro.git" target="_blank" rel="noopener noreferrer" 
             className="p-1.5 rounded-md hover:bg-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="relative p-4 border-b border-border">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="text"
          placeholder="Search components..."
          className="w-full pl-10 pr-4 py-2 rounded-md bg-background border border-input focus:border-primary focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {Object.keys(filteredComponents).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                 className="mb-4">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <p>No components found</p>
          </div>
        ) : (
          Object.entries(filteredComponents).map(([category, components]) => (
            <div key={category} className="mb-4">
              <button
                className="flex items-center justify-between w-full px-2 py-1.5 text-md font-medium hover:bg-accent rounded-md"
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${expandedCategories[category] ? 'rotate-0' : '-rotate-90'}`}
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              {expandedCategories[category] && (
                <div className="mt-1 space-y-0.5 pl-2">
                  {Object.entries(components).map(([name, component]) => (
                    <button
                      key={name}
                      className={`w-full px-2 py-1.5 text-left rounded-md ${
                        selectedComponent === name
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => onSelectComponent(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}