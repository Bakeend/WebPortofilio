import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Braces,
  Boxes,
  Database,
  Menu,
  Server,
  Sparkles,
  X,
} from 'lucide-react'
import Scene from './Scene.jsx'
import ProjectsCarousel from './ProjectsCarousel.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    name: 'OctoGames',
    image: '/images/projects/octogames.png',
    description: 'Marketplace de jogos, itens e contas digitais, com anúncios, carrinho e perfis de vendedores.',
    icon: Bot,
    accent: 'blue',
  },
  {
    name: 'Pixel Store',
    image: '/images/projects/pixel-store.png',
    description: 'Loja digital com foco em navegação rápida, identidade visual forte e integrações com a operação.',
    icon: Boxes,
    accent: 'orange',
  },
]

const stack = [
  ['Back-end', 'Python · Node.js · APIs', Braces],
  ['Dados', 'PostgreSQL · Supabase · Room', Database],
  ['Infra', 'Docker · Linux · Deploy', Server],
  ['IA aplicada', 'Modelos locais · Agentes · RAG', Sparkles],
]

export default function App() {
  const rootRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const nav = rootRef.current.querySelector('.nav')
      const expandedWidth = () => Math.min(1180, document.documentElement.clientWidth - (window.innerWidth <= 560 ? 24 : 40))
      const compactWidth = () => window.innerWidth <= 900
        ? Math.min(420, document.documentElement.clientWidth - 48)
        : 700

      gsap.fromTo(nav, {
        width: expandedWidth,
        height: 64,
        top: () => window.innerWidth <= 560 ? 12 : 20,
        borderRadius: 14,
        backgroundColor: 'rgba(10, 12, 14, 0.78)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0)',
      }, {
        width: compactWidth,
        height: 54,
        top: 12,
        borderRadius: 28,
        backgroundColor: 'rgba(10, 12, 14, 0.94)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 320,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => media.revert()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)

    const ctx = gsap.context(() => {
      gsap.from('.nav', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.hero-title .line, .hero-copy, .hero-actions', {
        y: 42,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.08,
      })
      gsap.from('.hero-scene', { scale: 0.78, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 })

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 55,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })

    }, rootRef)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      ctx.revert()
    }
  }, [])

  const goTo = (id) => {
    setMenuOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={rootRef} className="app-shell">
      <div className="noise" />
      <nav className="nav">
        <button className="brand" onClick={() => goTo('#home')} aria-label="Ir para o início">
          <span className="brand-mark" aria-hidden="true"><img src="/images/brand/bakeend-logo.png" alt="" draggable={false} /></span>
          <span>BAKEEND</span>
        </button>
        <div className="nav-links">
          <button onClick={() => goTo('#projetos')}>Projetos</button>
          <button onClick={() => goTo('#sobre')}>Sobre</button>
          <button onClick={() => goTo('#stack')}>Stack</button>
        </div>
        <a className="nav-cta" href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={15} />
        </a>
        <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => goTo('#projetos')}>Projetos</button>
          <button onClick={() => goTo('#sobre')}>Sobre</button>
          <button onClick={() => goTo('#stack')}>Stack</button>
        </div>
      )}

      <main>
        <section className="hero" id="home">
          <div className="hero-copywrap">
            <h1 className="hero-title">
              <span className="line">EU CONSTRUO</span>
              <span className="line outline outline-glow">
                SISTEMAS
              </span>
              <span className="line">QUE FUNCIONAM.</span>
            </h1>
            <p className="hero-copy">
              Back-end, bots, automações, IA aplicada e produtos digitais. Gosto de pegar uma ideia bagunçada e transformar em algo que dá para usar.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => goTo('#projetos')}>
                Ver projetos <ArrowDownRight size={18} />
              </button>
            </div>
          </div>
          <Scene />
        </section>

        <section className="section projects-section" id="projetos">
          <div className="section-heading reveal">
            <h2>Projetos que nasceram<br />de problemas reais.</h2>
          </div>
          <ProjectsCarousel projects={projects} />
        </section>

        <section className="section about-section" id="sobre">
          <div className="about-index reveal">02</div>
          <div className="about-copy reveal">
            <h2>Eu aprendo construindo.</h2>
            <p className="big-copy">
              Meu portfólio não é uma coleção de exercícios. São projetos que comecei porque queria resolver algo: organizar minha rotina, criar uma loja melhor, automatizar uma comunidade ou testar modelos de IA no meu próprio hardware.
            </p>
            <p className="small-copy">
              Curso Ciência da Computação e tenho interesse especial por back-end. Gosto de entender o sistema inteiro — interface, API, banco, infraestrutura e o que acontece quando alguma parte quebra.
            </p>
          </div>
          <div className="about-terminal reveal">
            <div className="terminal-bar"><span /><span /><span /></div>
            <pre><code><span className="term-muted">$</span> whoami{`\n`}<span className="term-lime">bakeend</span>{`\n\n`}<span className="term-muted">$</span> focus --current{`\n`}backend / systems / product{`\n\n`}<span className="term-muted">$</span> status{`\n`}<span className="term-lime">always building_</span></code></pre>
          </div>
        </section>

        <section className="section stack-section" id="stack">
          <div className="section-heading stack-heading reveal">
            <h2>Da ideia ao deploy.</h2>
          </div>
          <div className="stack-list">
            {stack.map(([title, items, Icon]) => (
              <div className="stack-row reveal" key={title}>
                <span className="stack-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{items}</p>
                <ArrowUpRight size={20} />
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-orbit" aria-hidden="true"><span>+</span></div>
          <h2 className="reveal">Tem uma ideia?<br /><span className="contact-outline-glow">VAMOS CONSTRUIR.</span></h2>
          <a className="contact-link reveal" href="https://github.com/" target="_blank" rel="noreferrer">
            github.com <ArrowUpRight size={24} />
          </a>
        </section>
      </main>
    </div>
  )
}




