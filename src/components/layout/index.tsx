import Sidebar from '../sidebar'
import ComponentViewer from '../component-viewer'
import { useMobile } from '../../hooks'
import { useState } from 'react'

export default function Layout() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const isMobile = useMobile()
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar 
        className={`${isMobile && selectedComponent ? 'hidden' : 'w-full md:w-64'} border-r border-border`}
        onSelectComponent={setSelectedComponent}
        selectedComponent={selectedComponent}
      />
      
      <ComponentViewer 
        className={`${isMobile && !selectedComponent ? 'hidden' : 'flex-1'} overflow-y-auto`}
        selectedComponent={selectedComponent}
        onBack={() => setSelectedComponent(null)}
      />
    </div>
  )
}