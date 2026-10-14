import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Braces,
  Boxes,
  Code2,
  Database,
  Globe2,
  Menu,
  Server,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'
import Globe from './Globe.jsx'
import { profile, technologies } from './data/profile.js'
import { projects } from './data/projects.js'
import ProjectsCarousel from './ProjectsCarousel.jsx'
import HoverStack from './components/ui/hover-stack.jsx'

gsap.registerPlugin(ScrollTrigger)

const rotatingWords = ['SISTEMAS', 'BOTS', 'APIS', 'AUTOMAÇÕES']

const projectIdeas = [
  {
    title: 'SITE',
    description: 'Landing page, portfólio, loja ou aplicação web com uma experiência feita para o projeto.',
    hint: 'WEB / PRODUTO',
    icon: Globe2,
  },
  {
    title: 'BOT',
    description: 'Bots para Discord, comunidades e rotinas que precisam responder, organizar ou executar ações.',
    hint: 'DISCORD / INTEGRAÇÕES',
    icon: Bot,
  },
  {
    title: 'API',
    description: 'Back-end, integrações e serviços para conectar dados, aplicações e regras de negócio.',
    hint: 'BACK-END / DADOS',
    icon: Code2,
  },
  {
    title: 'AUTOMAÇÃO',
    description: 'Fluxos que tiram trabalho repetitivo do caminho e conectam ferramentas sem depender de tarefas manuais.',
    hint: 'WORKFLOW / AGENTES',
    icon: Workflow,
  },
  {
    title: 'SISTEMA',
    description: 'Uma solução completa para uma ideia específica, do banco e da lógica até a interface e o deploy.',
    hint: 'FULL STACK / PRODUTO',
    icon: Boxes,
  },
]

export default function App() {
  const rootRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const [category, setCategory] = useState('Todos')
  const filteredProjects = useMemo(() => category === 'Todos' ? projects : projects.filter(project => project.category === category), [category])
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector('button')?.focus()
    const escape = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 901px)')
    const close = () => { if (desktop.matches) setMenuOpen(false) }
    const outside = (event) => { if (!event.target.closest('.nav, .mobile-menu')) setMenuOpen(false) }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', close)
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', close) }
  }, [menuOpen])

  useEffect(() => {
    if (reducedMotion) return

    const interval = window.setInterval(() => {
      if (document.hidden) return
      setWordIndex((current) => (current + 1) % rotatingWords.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [reducedMotion])

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
    if (reducedMotion) return

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
      gsap.from('.hero-title, .hero-copy, .hero-actions', {
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
  }, [reducedMotion])

  const goTo = (id) => {
    setMenuOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
    document.querySelector(id)?.focus({ preventScroll: true })
  }

  return (
    <div ref={rootRef} className="app-shell">
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <div className="noise" aria-hidden="true" />
      <nav className="nav" aria-label="Navegação principal">
        <button className="brand" onClick={() => goTo('#home')} aria-label="Ir para o início">
          <span className="brand-mark" aria-hidden="true"><img src="/images/brand/bakeend-logo.png" alt="" draggable={false} /></span>
          <span>BAKEEND</span>
        </button>
        <div className="nav-links">
          <button onClick={() => goTo('#projetos')}>Projetos</button>
          <button onClick={() => goTo('#sobre')}>Sobre</button>
          <button onClick={() => goTo('#stack')}>Stack</button>
          <button onClick={() => goTo('#contato')}>Contato</button>
        </div>
        <a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={15} />
        </a>
        <button ref={menuButtonRef} className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className="mobile-menu">
          <button onClick={() => goTo('#projetos')}>Projetos</button>
          <button onClick={() => goTo('#sobre')}>Sobre</button>
          <button onClick={() => goTo('#stack')}>Stack</button>
          <button onClick={() => goTo('#contato')}>Contato</button>
        </div>
      )}

      <main id="main" tabIndex={-1}>
        <section className="hero" id="home" tabIndex={-1}>
          <div className="hero-copywrap">
            <p className="hero-role">{profile.role}</p>
            <h1 className="hero-title" aria-label="Eu construo sistemas, bots, APIs e automações que funcionam.">
              <span className="line">EU CONSTRUO</span>
              <span className="line rotating-word-wrap" aria-hidden="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    className="outline outline-glow rotating-word"
                    initial={reducedMotion ? false : { opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                    transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="line">QUE FUNCIONAM.</span>
            </h1>
            <p className="hero-copy">
              {profile.description}
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => goTo('#projetos')}>
                Explorar projetos <ArrowDownRight size={18} />
              </button>
              <a className="text-button" href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a>
              <button className="text-button" onClick={() => goTo('#contato')}>Entrar em contato</button>
            </div>
          </div>
          <Globe />
        </section>

        <section className="section projects-section" id="projetos" tabIndex={-1}>
          <div className="section-heading reveal">
            <h2>Ideias reais.<br />Projetos em construção.</h2>
          </div>
          <div className="project-filters" role="group" aria-label="Filtrar projetos por categoria">{['Todos', 'Web', 'IA'].map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
          <ProjectsCarousel key={category} projects={filteredProjects} />
        </section>

        <section className="section about-section" id="sobre" tabIndex={-1}>
          <div className="about-index reveal" aria-hidden="true">02</div>
          <div className="about-copy reveal">
            <h2>Aprendo fazendo.</h2>
            <p className="big-copy">
              Sou estudante de Ciência da Computação e aprendo construindo. Meu maior interesse está no back-end: entender os dados, a lógica e as decisões que fazem um sistema funcionar.
            </p>
            <p className="small-copy">
              Gosto de investigar erros, testar ferramentas e entender como as partes se conectam. Linux, infraestrutura e IA fazem parte do que estudo. Busco uma oportunidade de estágio ou uma posição inicial para evoluir com uma equipe e construir software útil.
            </p>
          </div>
          <div className="about-terminal reveal">
            <div className="terminal-bar"><span /><span /><span /></div>
            <pre><code><span className="term-muted">$</span> whoami{`\n`}<span className="term-lime">bakeend</span>{`\n\n`}<span className="term-muted">$</span> focus --current{`\n`}back-end / Linux / IA{`\n\n`}<span className="term-muted">$</span> status{`\n`}<span className="term-lime">aprendendo e construindo_</span></code></pre>
          </div>
        </section>

        <section className="section stack-section" id="stack" tabIndex={-1}>
          <div className="section-heading stack-heading reveal">
            <h2>Ferramentas e próximos passos.</h2>
          </div>
          <div className="stack-list">
            {technologies.map(({title, practice, study}, index) => {
              const Icon = [Braces, Code2, Database, Server, Sparkles][index]
              return (
              <div className="stack-row reveal" key={title}>
                <span className="stack-icon"><Icon size={22} /></span>
                <h3>{title}</h3>
                <div className="stack-details">{practice && <p><span>Em projetos</span>{practice}</p>}{study && <p><span>Em estudo</span>{study}</p>}</div>
                <ArrowUpRight size={20} />
              </div>
            )})}
          </div>
        </section>

        <section id="contato" tabIndex={-1} className="contact-section">
          <div className="contact-orbit" aria-hidden="true"><span>+</span></div>
          <div className="contact-intro reveal">
            <h2>O que você<br /><span className="contact-outline-glow">tem em mente?</span></h2>
            <a className="contact-link" href={profile.github} target="_blank" rel="noreferrer">
              Encontrar no GitHub <ArrowUpRight size={24} />
            </a>
          </div>
          <div className="contact-stack-wrap reveal">
            <p className="contact-copy">Tipos de solução que gosto de explorar. Tem uma ideia ou uma oportunidade em back-end? Conheça meu trabalho e meu perfil no GitHub.</p>
            <HoverStack items={projectIdeas} />
          </div>
        </section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Bakeend</span><span>Aprendendo. Construindo. Evoluindo.</span><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><button onClick={() => goTo('#contato')}>Contato</button></footer>
    </div>
  )
}




