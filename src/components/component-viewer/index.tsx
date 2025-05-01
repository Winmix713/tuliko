import { useMobile } from '../../hooks'
import { components } from '../../config/components'
import CodePreview from '../code-preview'

interface ComponentViewerProps {
  className?: string
  selectedComponent: string | null
  onBack?: () => void
}

export default function ComponentViewer({ 
  className = '', 
  selectedComponent,
  onBack
}: ComponentViewerProps) {
  const isMobile = useMobile()

  // Find component data
  let componentData = null
  let categoryName = ''

  if (selectedComponent) {
    for (const [category, categoryComponents] of Object.entries(components)) {
      if (selectedComponent in categoryComponents) {
        componentData = categoryComponents[selectedComponent]
        categoryName = category
        break
      }
    }
  }

  if (!selectedComponent || !componentData) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
             className="mb-4 text-muted-foreground">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <path d="M12 17h.01"></path>
        </svg>
        <h2 className="text-xl font-medium mb-2">No Component Selected</h2>
        <p className="text-muted-foreground text-center px-4">
          Select a component from the sidebar to view its details and preview
        </p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {isMobile && (
        <div className="flex items-center px-4 py-2 border-b border-border">
          <button
            onClick={onBack}
            className="mr-2 p-1 rounded-md hover:bg-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <h2 className="text-lg font-medium">{selectedComponent}</h2>
        </div>
      )}

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{selectedComponent}</h1>
          <p className="text-muted-foreground">
            {categoryName} • {componentData.description}
          </p>
        </div>

        <div className="mb-8 p-8 rounded-lg border border-border bg-card flex items-center justify-center">
          {componentData.component && <componentData.component />}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Code</h2>
            <CodePreview code={componentData.code} language="tsx" />
          </div>

          {componentData.cssCode && (
            <div>
              <h2 className="text-xl font-semibold mb-3">CSS</h2>
              <CodePreview code={componentData.cssCode} language="css" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}