import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const ROTATIONS = [-5, 3.5, -2.5, 4.5, -3.5, 2.5]

export default function HoverStack({ items }) {
  const stackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [width, setWidth] = useState(0)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return undefined

    const media = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)')
    const updateMode = () => {
      setInteractive(media.matches)
      if (!media.matches) setActiveIndex(null)
    }
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))

    updateMode()
    observer.observe(stack)
    media.addEventListener?.('change', updateMode)

    return () => {
      observer.disconnect()
      media.removeEventListener?.('change', updateMode)
    }
  }, [])

  const layout = useMemo(() => {
    if (!interactive || !width || items.length < 2) return null

    const sidePad = Math.min(38, Math.max(24, width * 0.055))
    const cardWidth = Math.min(286, Math.max(224, width * 0.41))
    const overlap = (width - sidePad * 2 - cardWidth) / (items.length - 1)
    const push = Math.max(18, Math.min(30, sidePad - 6))

    return { sidePad, cardWidth, overlap, push }
  }, [interactive, items.length, width])

  return (
    <div
      ref={stackRef}
      className={`hover-stack${interactive ? ' is-interactive' : ''}`}
      aria-label="Tipos de projeto"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {items.map((item, index) => {
        const Icon = item.icon
        const isActive = interactive && activeIndex === index
        const hasActive = interactive && activeIndex !== null
        const direction = hasActive ? Math.sign(index - activeIndex) : 0
        const x = layout ? layout.sidePad + index * layout.overlap + direction * layout.push : 0
        const rotation = isActive ? 0 : ROTATIONS[index % ROTATIONS.length]
        const style = layout
          ? {
              '--stack-x': `${x}px`,
              '--stack-rotate': `${rotation}deg`,
              '--stack-width': `${layout.cardWidth}px`,
              '--stack-z': isActive ? 50 : index + 1,
              '--stack-lift': isActive ? '-22px' : '0px',
              '--stack-scale': isActive ? 1.025 : 1,
            }
          : undefined

        return (
          <a
            key={item.title}
            className={`hover-stack-item${isActive ? ' is-active' : ''}`}
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.title}: ${item.description}`}
            style={style}
            onMouseEnter={() => interactive && setActiveIndex(index)}
            onFocus={() => interactive && setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          >
            <article className="hover-stack-card">
              <div className="hover-stack-topline">
                <span className="hover-stack-number">0{index + 1}</span>
                <span className="hover-stack-icon" aria-hidden="true"><Icon size={20} /></span>
              </div>

              <div className="hover-stack-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="hover-stack-footer">
                <span>{item.hint}</span>
                <ArrowUpRight size={17} />
              </div>
            </article>
          </a>
        )
      })}
    </div>
  )
}
