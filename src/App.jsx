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
  CircleDot,
  Database,
  Menu,
  Server,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react'
import Scene from './Scene.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    name: 'ProAI',
    type: 'Orquestração de agentes',
    description: 'Um laboratório para coordenar modelos diferentes por função, custo e complexidade da tarefa.',
    tags: ['Python', 'LLMs', 'Orquestração'],
    icon: Sparkles,
    accent: 'lime',
  },
  {
    number: '02',
    name: 'OctoGames',
    type: 'Bot + infraestrutura',
    description: 'Bot construído para crescer de verdade: comandos, economia, PostgreSQL, observabilidade e deploy.',
    tags: ['Discord', 'PostgreSQL', 'Docker'],
    icon: Bot,
    accent: 'blue',
  },
  {
    number: '03',
    name: 'Pixel Store',
    type: 'E-commerce / experiência web',
    description: 'Loja digital com foco em navegação rápida, identidade visual forte e integrações com a operação.',
    tags: ['Web', 'API', 'UX'],
    icon: Boxes,
    accent: 'orange',
  },
  {
    number: '04',
    name: 'Organizei',
    type: 'Produto pessoal',
    description: 'Finanças, tarefas, notas, calendário e planejamento reunidos em um sistema local e simples de usar.',
    tags: ['Kotlin', 'Room', 'Produto'],
    icon: WalletCards,
    accent: 'violet',
  },
]

const stack = [
  ['Back-end', 'Python · Node.js · APIs', Braces],
  ['Dados', 'PostgreSQL · Supabase · Room', Database],
  ['Infra', 'Docker · Linux · Deploy', Server],
  ['IA aplicada', 'Modelos locais · Agentes · RAG', Sparkles],
]

function ProjectCard({ project }) {
  const Icon = project.icon
  return (
    <article className={`project-card project-${project.accent}`}>
      <div className="project-topline">
        <span>{project.number}</span>
        <div className="project-icon"><Icon size={20} /></div>
      </div>
      <div className="project-content">
        <p className="project-type">{project.type}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div className="project-footer">
        <div className="tag-row">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <span className="project-arrow"><ArrowUpRight size={21} /></span>
      </div>
    </article>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
      gsap.from('.hero-kicker, .hero-title .line, .hero-copy, .hero-actions', {
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

      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 70,
          rotateX: 7,
          opacity: 0,
          duration: 0.9,
          delay: index * 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        })
      })

      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        duration: 28,
        repeat: -1,
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
          <span className="brand-mark">B</span>
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
          <div className="hero-grid" />
          <div className="hero-copywrap">
            <p className="hero-kicker"><span className="status-dot" /> Estudante de Ciência da Computação · SP, Brasil</p>
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
              <span className="hero-note">Disponível para estágio<br />e novos projetos.</span>
            </div>
          </div>
          <Scene />
          <div className="hero-corner top-right">42°54' · BUILD / TEST / SHIP</div>
          <div className="hero-corner bottom-right">SCROLL_001 <ArrowDownRight size={14} /></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div className="marquee-set" key={idx}>
                <span>BACK-END</span><CircleDot /><span>AUTOMAÇÃO</span><CircleDot /><span>BOTS</span><CircleDot /><span>PRODUTOS</span><CircleDot /><span>IA LOCAL</span><CircleDot />
              </div>
            ))}
          </div>
        </div>

        <section className="section projects-section" id="projetos">
          <div className="section-heading reveal">
            <p>01 / TRABALHOS SELECIONADOS</p>
            <h2>Projetos que nasceram<br />de problemas reais.</h2>
          </div>
          <div className="projects-grid">
            {projects.map((project) => <ProjectCard project={project} key={project.name} />)}
          </div>
        </section>

        <section className="section about-section" id="sobre">
          <div className="about-index reveal">02</div>
          <div className="about-copy reveal">
            <p className="eyebrow">SOBRE MIM</p>
            <h2>Eu aprendo construindo.</h2>
            <p className="big-copy">
              Meu portfólio não é uma coleção de exercícios. São projetos que comecei porque queria resolver algo: organizar minha rotina, criar uma loja melhor, automatizar uma comunidade ou testar modelos de IA no meu próprio hardware.
            </p>
            <p className="small-copy">
              Curso Ciência da Computação e tenho interesse especial por back-end. Gosto de entender o sistema inteiro — interface, API, banco, infraestrutura e o que acontece quando alguma parte quebra.
            </p>
          </div>
          <div className="about-terminal reveal">
            <div className="terminal-bar"><span /><span /><span /><em>profile.sh</em></div>
            <pre><code><span className="term-muted">$</span> whoami{`\n`}<span className="term-lime">bakeend</span>{`\n\n`}<span className="term-muted">$</span> focus --current{`\n`}backend / systems / product{`\n\n`}<span className="term-muted">$</span> status{`\n`}<span className="term-lime">always building_</span></code></pre>
          </div>
        </section>

        <section className="section stack-section" id="stack">
          <div className="section-heading stack-heading reveal">
            <p>03 / FERRAMENTAS</p>
            <h2>Da ideia ao deploy.</h2>
          </div>
          <div className="stack-list">
            {stack.map(([title, items, Icon], index) => (
              <div className="stack-row reveal" key={title}>
                <span className="stack-number">0{index + 1}</span>
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
          <p className="reveal">04 / PRÓXIMO PASSO</p>
          <h2 className="reveal">Tem uma ideia?<br /><span className="contact-outline-glow">VAMOS CONSTRUIR.</span></h2>
          <a className="contact-link reveal" href="https://github.com/" target="_blank" rel="noreferrer">
            github.com <ArrowUpRight size={24} />
          </a>
        </section>
      </main>

      <footer>
        <span>© 2026 BAKEEND</span>
        <span>DESENVOLVIDO COM REACT + GSAP + THREE.JS</span>
        <a href="#home">VOLTAR AO TOPO ↑</a>
      </footer>
    </div>
  )
}
