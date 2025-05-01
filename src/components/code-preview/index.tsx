interface CodePreviewProps {
  code: string
  language?: string
}

export default function CodePreview({ code, language = 'tsx' }: CodePreviewProps) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="bg-muted p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium">{language.toUpperCase()}</span>
        <button 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            navigator.clipboard.writeText(code)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
        </button>
      </div>
      <pre className="bg-muted p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}