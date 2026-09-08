import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
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
import Scene from './Scene.jsx'
import ProjectsCarousel from './ProjectsCarousel.jsx'
import HoverStack from './components/ui/hover-stack.jsx'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    name: 'OctoGames',
    image: '/images/projects/octogames.png',
    description: 'Marketplace de jogos, itens e contas digitais com anúncios, carrinho e perfis de vendedores.',
    icon: Bot,
    accent: 'blue',
  },
  {
    name: 'Pixel Store',
    image: '/images/projects/pixel-store.png',
    description: 'Loja digital com navegação rápida, identidade visual própria e integrações usadas na operação.',
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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % rotatingWords.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

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
              <span className="line rotating-word-wrap" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    className="outline outline-glow rotating-word"
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="line">QUE FUNCIONAM.</span>
            </h1>
            <p className="hero-copy">
              Faço projetos de back-end, bots, automações, IA aplicada e produtos digitais. Normalmente começo com uma ideia meio bagunçada e vou montando até virar algo que dá para usar.
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
            <h2>Projetos que comecei<br />para resolver alguma coisa.</h2>
          </div>
          <ProjectsCarousel projects={projects} />
        </section>

        <section className="section about-section" id="sobre">
          <div className="about-index reveal">02</div>
          <div className="about-copy reveal">
            <h2>Aprendo fazendo.</h2>
            <p className="big-copy">
              Cada projeto daqui começou por uma necessidade minha: organizar minha rotina, criar uma loja melhor, automatizar uma comunidade ou testar modelos de IA no meu próprio hardware.
            </p>
            <p className="small-copy">
              Curso Ciência da Computação e me interesso principalmente por back-end. Gosto de entender o sistema inteiro: interface, API, banco, infraestrutura e o que acontece quando alguma parte quebra.
            </p>
          </div>
          <div className="about-terminal reveal">
            <div className="terminal-bar"><span /><span /><span /></div>
            <pre><code><span className="term-muted">$</span> whoami{`\n`}<span className="term-lime">bakeend</span>{`\n\n`}<span className="term-muted">$</span> focus --current{`\n`}backend / systems / product{`\n\n`}<span className="term-muted">$</span> status{`\n`}<span className="term-lime">always building_</span></code></pre>
          </div>
        </section>

        <section className="section stack-section" id="stack">
          <div className="section-heading stack-heading reveal">
            <h2>O que uso nos projetos.</h2>
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

        <section id="contato" className="contact-section">
          <div className="contact-orbit" aria-hidden="true"><span>+</span></div>
          <div className="contact-intro reveal">
            <span className="contact-kicker">TEM ALGO PARA CRIAR?</span>
            <h2>O que você<br /><span className="contact-outline-glow">tem em mente?</span></h2>
            <p>Explore as ideias. Pode ser uma delas, uma mistura de várias ou algo que ainda nem tem nome.</p>
            <a className="contact-link" href="https://github.com/" target="_blank" rel="noreferrer">
              Vamos conversar <ArrowUpRight size={24} />
            </a>
          </div>
          <div className="contact-stack-wrap reveal">
            <HoverStack items={projectIdeas} />
          </div>
        </section>
      </main>
    </div>
  )
}




