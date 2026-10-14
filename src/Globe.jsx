import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'

const Scene = lazy(() => import('./Scene.jsx'))
export function GlobeFallback() {
  return <div className="globe-fallback" role="img" aria-label="Representação estática do globo terrestre"><span>◎</span><small>IDEIAS CONECTADAS</small></div>
}
class GlobeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <GlobeFallback /> : this.props.children }
}
export default function Globe() {
  const host = useRef(null)
  const [load, setLoad] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoad(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return <div className="hero-scene" ref={host}><GlobeBoundary><Suspense fallback={<GlobeFallback />}>{load ? <Scene /> : <GlobeFallback />}</Suspense></GlobeBoundary></div>
}
