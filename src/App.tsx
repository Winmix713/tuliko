import { ThemeProvider } from './components/theme-provider'
import Layout from './components/layout'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Layout />
    </ThemeProvider>
  )
}

export default App