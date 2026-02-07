import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--vibe-light)] relative selection:bg-premium-violet/10">
      {/* Warm Aesthetic Background */}
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-noise opacity-[0.01] pointer-events-none" />

      {/* Ambient Glows (Warm & Soft) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-orange-100/30 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-premium-violet/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main layout */}
      <div className={`relative transition-all duration-500 ease-in-out ${sidebarOpen ? 'lg:pl-72' : ''}`}>
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        {/* Main content */}
        <main className="relative z-10 min-h-[calc(100vh-160px)]">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Layout

