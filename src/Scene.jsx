import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import land from './data/land.json'

const RADIUS = 1.35
const polygons = land.features.flatMap(({ geometry }) => (
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
))

function position(lon, lat, radius = RADIUS) {
  const phi = THREE.MathUtils.degToRad(lat)
  const theta = THREE.MathUtils.degToRad(lon)
  return new THREE.Vector3(radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta))
}

function insideRing(lon, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x, y] = ring[i]
    const [px, py] = ring[j]
    if ((y > lat) !== (py > lat) && lon < (px - x) * (lat - y) / (py - y) + x) inside = !inside
  }
  return inside
}

function makeGeography() {
  const coast = []
  const dots = []
  const regions = polygons.map((rings) => ({
    rings,
    minX: Math.min(...rings[0].map(([x]) => x)),
    maxX: Math.max(...rings[0].map(([x]) => x)),
    minY: Math.min(...rings[0].map(([, y]) => y)),
    maxY: Math.max(...rings[0].map(([, y]) => y)),
  }))
  for (const { rings } of regions) {
    for (const ring of rings) {
      for (let i = 1; i < ring.length; i++) {
        const a = position(...ring[i - 1], RADIUS + 0.006)
        const b = position(...ring[i], RADIUS + 0.006)
        const steps = Math.max(1, Math.ceil(a.distanceTo(b) / 0.025))
        for (let j = 0; j < steps; j++) {
          coast.push(...a.clone().lerp(b, j / steps).setLength(RADIUS + 0.006).toArray())
          coast.push(...a.clone().lerp(b, (j + 1) / steps).setLength(RADIUS + 0.006).toArray())
        }
      }
    }
  }
  for (let lat = -84; lat <= 84; lat += 1.5) {
    const step = 1.5 / Math.cos(THREE.MathUtils.degToRad(lat))
    for (let lon = -180; lon < 180; lon += step) {
      if (regions.some(({ rings, minX, maxX, minY, maxY }) => (
        lon >= minX && lon <= maxX && lat >= minY && lat <= maxY
        && insideRing(lon, lat, rings[0]) && !rings.slice(1).some((ring) => insideRing(lon, lat, ring))
      ))) dots.push(...position(lon, lat, RADIUS + 0.009).toArray())
    }
  }
  return { coast, dots }
}

// Natural Earth public-domain land polygons, bundled locally; no runtime map requests.
const geography = makeGeography()

export default function Scene() {
  const mountRef = useRef(null)


  useEffect(() => {
    const host = mountRef.current
    if (!host) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 5.8)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)
    const canvas = renderer.domElement
    canvas.tabIndex = 0
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', 'Terra interativa. Arraste para girar, use scroll ou pinça para zoom. No teclado: setas para girar, mais e menos para zoom, Home para restaurar.')
    canvas.setAttribute('data-lenis-prevent', '')
    const controls = new OrbitControls(camera, canvas)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.rotateSpeed = 0.65
    controls.zoomSpeed = 0.65
    controls.minDistance = 3.6
    controls.maxDistance = 7.5
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
    let interacting = false
    let resumeAt = 0
    const onStart = () => {
      interacting = true
      host.classList.add('is-dragging')
      canvas.focus({ preventScroll: true })
    }
    const onEnd = () => {
      interacting = false
      resumeAt = performance.now() + 2500
      host.classList.remove('is-dragging')
    }
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)

    const group = new THREE.Group()
    scene.add(group)
    const earth = new THREE.Group()
    earth.rotation.y = 0.75
    earth.rotation.z = -0.12
    group.add(earth)
    earth.add(new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 48),
      new THREE.MeshBasicMaterial({
        color: getComputedStyle(host).getPropertyValue('--bg').trim() || '#080a0c',
        toneMapped: false,
      }),
    ))

    const buffer = (values) => new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(values, 3))
    earth.add(new THREE.LineSegments(buffer(geography.coast), new THREE.LineBasicMaterial({ color: 0xb7ff41, transparent: true, opacity: 0.62 })))
    earth.add(new THREE.Points(buffer(geography.dots), new THREE.PointsMaterial({ color: 0xb7ff41, size: 0.012, transparent: true, opacity: 0.85 })))

    const grid = []
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 2) grid.push(...position(lon, lat, RADIUS + 0.002).toArray(), ...position(lon + 2, lat, RADIUS + 0.002).toArray())
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -90; lat < 90; lat += 2) grid.push(...position(lon, lat, RADIUS + 0.002).toArray(), ...position(lon, lat + 2, RADIUS + 0.002).toArray())
    }
    earth.add(new THREE.LineSegments(buffer(grid), new THREE.LineBasicMaterial({ color: 0x689a50, transparent: true, opacity: 0.17 })))

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.045, 64, 48), new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { color: { value: new THREE.Color(0x93e84b) } },
      vertexShader: `varying vec3 vNormal; varying vec3 vView;
        void main() { vec4 p = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = -p.xyz; gl_Position = projectionMatrix * p; }`,
      fragmentShader: `uniform vec3 color; varying vec3 vNormal; varying vec3 vView;
        void main() { float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 4.0); gl_FragColor = vec4(color, rim * 0.26); }`,
    }))
    group.add(atmosphere)

    const cities = [[-46.63, -23.55], [-74.01, 40.71], [-0.12, 51.51], [13.4, 52.52], [139.69, 35.68], [103.82, 1.35]]
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xd8ff99 })
    const nodeGeometry = new THREE.SphereGeometry(0.018, 12, 8)
    cities.forEach(([lon, lat]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      node.position.copy(position(lon, lat, RADIUS + 0.018))
      earth.add(node)
    })
    const routes = [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5]]
    const packets = routes.map(([from, to]) => {
      const a = position(...cities[from], 1)
      const b = position(...cities[to], 1)
      const angle = a.angleTo(b)
      const points = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64
        return a.clone().multiplyScalar(Math.sin((1 - t) * angle)).addScaledVector(b, Math.sin(t * angle)).normalize().multiplyScalar(RADIUS + 0.025 + Math.sin(t * Math.PI) * 0.2)
      })
      earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xb7ff41, transparent: true, opacity: 0.28 })))
      const packet = new THREE.Mesh(nodeGeometry, nodeMaterial)
      packet.scale.setScalar(0.65)
      earth.add(packet)
      return { packet, points }
    })

    const orbit = new THREE.Group()
    orbit.rotation.set(Math.PI * 0.64, Math.PI * 0.12, -0.25)
    group.add(orbit)
    const orbitPoints = Array.from({ length: 241 }, (_, i) => new THREE.Vector3(Math.cos(i / 240 * Math.PI * 2) * 1.77, Math.sin(i / 240 * Math.PI * 2) * 1.77, 0))
    orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(orbitPoints), new THREE.LineBasicMaterial({ color: 0x9ab68c, transparent: true, opacity: 0.3 })))
    const satellite = new THREE.Mesh(nodeGeometry, nodeMaterial)
    orbit.add(satellite)

    const positions = []
    for (let i = 0; i < 650; i++) {
      const radius = 2.4 + Math.random() * 2.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta))
    }
    const stars = new THREE.Points(buffer(positions), new THREE.PointsMaterial({ size: 0.009, color: 0xc9d1d9, transparent: true, opacity: 0.36 }))
    scene.add(stars)

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reset = () => {
      controls.reset()
      earth.rotation.set(0, 0.75, -0.12)
      resumeAt = performance.now() + 2500
    }

    const onKeyDown = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return
      event.preventDefault()
      resumeAt = performance.now() + 2500
      if (event.key === 'Home') return reset()
      if (event.key === 'ArrowLeft') earth.rotation.y -= 0.12
      if (event.key === 'ArrowRight') earth.rotation.y += 0.12
      if (event.key === 'ArrowUp') earth.rotation.x -= 0.12
      if (event.key === 'ArrowDown') earth.rotation.x += 0.12
      if (['+', '=', '-'].includes(event.key)) {
        camera.position.setLength(THREE.MathUtils.clamp(camera.position.length() * (event.key === '-' ? 1.1 : 0.9), controls.minDistance, controls.maxDistance))
      }
      controls.update()
    }
    canvas.addEventListener('keydown', onKeyDown)
    let frame
    let previous = performance.now()
    let elapsed = 0
    const animate = (now) => {
      const delta = Math.max(0, Math.min((now - previous) / 1000, 0.05))
      previous = now
      if (!motion.matches && !document.hidden) elapsed += delta
      const t = elapsed
      if (!motion.matches && !document.hidden && !interacting && now >= resumeAt) earth.rotation.y += delta * 0.045
      controls.update(delta)
      satellite.position.set(Math.cos(t * 0.22) * 1.77, Math.sin(t * 0.22) * 1.77, 0)
      packets.forEach(({ packet, points }, index) => {
        const progress = ((t * 0.12 + index / packets.length) % 1) * 64
        const i = Math.min(63, Math.floor(progress))
        packet.position.copy(points[i]).lerp(points[i + 1], progress - i)
      })
      if (!document.hidden) renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    const observer = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight)
    })
    observer.observe(host)

    return () => {
      cancelAnimationFrame(frame)
      canvas.removeEventListener('keydown', onKeyDown)
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      controls.dispose()

      host.classList.remove('is-dragging')
      observer.disconnect()
      const geometries = new Set()
      const materials = new Set()
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry)
        if (object.material) materials.add(object.material)
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="hero-scene" ref={mountRef} role="group" aria-label="Planeta Terra interativo">
    </div>
  )
}


