import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CameraViewport } from './components/CameraViewport'
import { Workflow } from './components/Workflow'
import { MovementShowcase } from './components/MovementShowcase'
import { BlenderSection } from './components/BlenderSection'
import { CustomPath } from './components/CustomPath'
import { Features } from './components/Features'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <CameraViewport />
        <Workflow />
        <MovementShowcase />
        <BlenderSection />
        <CustomPath />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
