import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, WalletCards } from 'lucide-react'
import './ProjectsCarousel.css'

function ProjectArtwork({ project }) {
  if (project.image) return (
    <div className="project-art art-screenshot">
      <div className="project-preview">
        <div className="preview-bar" aria-hidden="true"><i /><i /><i /><span>{project.name}</span></div>
        <img src={project.image} alt={`Captura de tela do projeto ${project.name}`} loading="lazy" decoding="async" draggable={false} />
      </div>
    </div>
  )
  return (
    <div className="project-art art-organizei" aria-hidden="true">
      <div className="planner-sheet"><div className="planner-top"><WalletCards size={20} /><span>organizei</span><i /></div><h4>Espaço para<br />o que importa.</h4><div className="planner-week">{'DSTQQSS'.split('').map((day, i) => <span key={i} className={i === 3 ? 'selected' : ''}>{day}<b>{12 + i}</b></span>)}</div><div className="planner-task"><i /> Planejar a semana<span>01</span></div><div className="planner-task"><i /> Tirar ideias do papel<span>02</span></div><div className="planner-task"><i /> Organizar as finanças<span>03</span></div></div>
      <div className="planner-note">Menos caos.<br /><b>Mais clareza.</b><span>↗</span></div>
    </div>
  )
}

export default function ProjectsCarousel({ projects }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const navigateRef = useRef(() => {})
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const slides = [...track.children]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let current = 0
    let drag = null
    let tween
    let step = 0
    const navigate = (index, immediate = false) => {
      current = Math.max(0, Math.min(projects.length - 1, index))
      setActive(current)
      tween?.kill()
      tween = gsap.to(track, { x: -current * step, duration: immediate || motion.matches ? 0 : 0.8, ease: 'power3.out', overwrite: true })
      slides.forEach((slide, i) => {
        slide.inert = i !== current
        slide.setAttribute('aria-hidden', String(i !== current))
      })
    }
    navigateRef.current = navigate
    const resize = new ResizeObserver(() => {
      step = slides[1].offsetLeft - slides[0].offsetLeft
      navigate(current, true)
    })
    resize.observe(viewport)
    const down = (event) => {
      if (event.button !== 0 || event.target.closest('button, a')) return
      tween?.kill()
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: Number(gsap.getProperty(track, 'x')), horizontal: false }
    }
    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (!drag.horizontal) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; navigate(current); return }
        drag.horizontal = true
        viewport.setPointerCapture(event.pointerId)
        viewport.classList.add('is-dragging')
      }
      const x = drag.origin + dx
      const min = -(projects.length - 1) * step
      gsap.set(track, { x: x > 0 ? x * 0.22 : x < min ? min + (x - min) * 0.22 : x })
    }
    const end = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const next = event.type === 'pointercancel' || !drag.horizontal ? current : Math.abs(dx) > Math.min(65, step * 0.15) ? current + (dx < 0 ? 1 : -1) : current
      drag = null
      viewport.classList.remove('is-dragging')
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
      navigate(next)
    }
    viewport.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      tween?.kill()
      resize.disconnect()
      viewport.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      navigateRef.current = () => {}
    }
  }, [projects.length])

  return (
    <div className="projects-carousel" role="region" aria-roledescription="carrossel" aria-label="Projetos selecionados" onKeyDown={(event) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault()
        navigateRef.current(event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }}>
      <div className="carousel-viewport" ref={viewportRef} tabIndex={0} aria-label="Arraste ou use as setas do teclado para navegar">
        <div className="carousel-track" ref={trackRef}>
          {projects.map((project, index) => (
            <article key={project.name} className={`project-slide slide-${project.accent} ${active === index ? 'is-active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${projects.length}: ${project.name}`}>
              <div className="slide-copy"><div className="slide-category"><span>{String(index + 1).padStart(2, '0')} /</span>{project.type}</div><h3>{project.name}</h3><p>{project.description}</p><div className="slide-tags">{(project.tags ?? []).map(tag => <span key={tag}>{tag}</span>)}</div><div className="slide-signature"><span className="signature-line" />IDEIA → CÓDIGO → PRODUTO</div></div>
              <ProjectArtwork project={project} />
            </article>
          ))}
        </div>
      </div>
      <div className="carousel-footer">
        <div className="carousel-pagination" aria-label="Escolher projeto">{projects.map((project, index) => <button key={project.name} type="button" onClick={() => navigateRef.current(index)} aria-label={`Mostrar ${project.name}`} aria-current={active === index ? 'true' : undefined}><span className={active === index ? 'selected' : ''} /></button>)}</div>
        <span className="carousel-counter" aria-live="polite" aria-atomic="true"><b>{String(active + 1).padStart(2, '0')}</b> / {String(projects.length).padStart(2, '0')}<span className="sr-only"> — {projects[active].name}</span></span>
        <div className="carousel-arrows"><button type="button" aria-label="Projeto anterior" disabled={active === 0} onClick={() => navigateRef.current(active - 1)}><ArrowLeft size={21} /></button><button type="button" aria-label="Próximo projeto" disabled={active === projects.length - 1} onClick={() => navigateRef.current(active + 1)}><ArrowRight size={21} /></button></div>
      </div>
    </div>
  )
}


