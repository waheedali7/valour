'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SNAP_DURATION = 0.9
// A wheel event starts a new gesture when it comes after a pause, or is
// clearly stronger than the one before it (trackpad inertia only decays).
const GESTURE_GAP_MS = 120
const SNAP_EPSILON = 2
// How long after a resize ScrollTrigger's own refresh may still move the scroll.
const REALIGN_WINDOW_MS = 800

const isEditable = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

// True when `el` (or an ancestor below the scroller) can still scroll in the
// wheel direction, e.g. a modal body, so we leave that event alone.
const canScrollInside = (el, scroller, dy) => {
  for (let n = el; n && n !== scroller; n = n.parentElement) {
    if (!(n instanceof HTMLElement)) continue
    const { overflowY } = getComputedStyle(n)
    if (!/(auto|scroll)/.test(overflowY) || n.scrollHeight <= n.clientHeight) continue
    if (dy > 0 ? n.scrollTop + n.clientHeight < n.scrollHeight - 1 : n.scrollTop > 0) return true
  }
  return false
}

// An open cart sidebar / appointment modal owns the wheel and keyboard.
const overlayOpen = () =>
  Boolean(document.querySelector('[role="dialog"]:not([inert]), .modal-overlay.active'))

export default function ScrollProvider({ children }) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    ScrollTrigger.defaults({ scroller })

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let tween = null
    let animating = false
    let activeIdx = 0
    // Viewport height the current activeIdx was measured at. Native snapping
    // and layout shifts during a resize also fire scroll events; those must
    // not overwrite activeIdx because the section offsets have just changed.
    let stableH = scroller.clientHeight
    let lastWheelAt = 0
    let lastDelta = 0
    let settleTimer
    let resizeRaf
    let realignUntil = 0

    const getSections = () => Array.from(scroller.querySelectorAll('.snap-section'))

    const nearestIndex = (sections) => {
      let idx = 0
      let min = Infinity
      sections.forEach((sec, i) => {
        const dist = Math.abs(sec.offsetTop - scroller.scrollTop)
        if (dist < min) {
          min = dist
          idx = i
        }
      })
      return idx
    }

    // Next/previous section in `direction`, working from the real scroll
    // position so an interrupted or mid-section scroll still lands correctly.
    const targetIndex = (sections, direction) => {
      const st = scroller.scrollTop
      if (direction > 0) {
        const i = sections.findIndex((s) => s.offsetTop > st + SNAP_EPSILON)
        return i === -1 ? sections.length - 1 : i
      }
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop < st - SNAP_EPSILON) return i
      }
      return 0
    }

    const syncActive = () => {
      if (scroller.clientHeight === stableH) activeIdx = nearestIndex(getSections())
    }

    const finish = () => {
      animating = false
      tween = null
      scroller.style.scrollSnapType = ''
      syncActive()
    }

    const goTo = (sections, idx) => {
      const top = sections[idx].offsetTop
      if (Math.abs(scroller.scrollTop - top) <= SNAP_EPSILON) {
        activeIdx = idx
        return
      }
      animating = true
      // Native snapping would fight the tween frame by frame.
      scroller.style.scrollSnapType = 'none'
      tween = gsap.to(scroller, {
        scrollTop: top,
        duration: reduceMotion.matches ? 0 : SNAP_DURATION,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: finish,
        onInterrupt: finish,
      })
    }

    const step = (direction) => {
      if (animating) return
      const sections = getSections()
      if (sections.length) goTo(sections, targetIndex(sections, direction))
    }

    const onWheel = (e) => {
      if (e.ctrlKey || e.deltaY === 0) return // pinch-zoom / horizontal scroll
      if (overlayOpen() || canScrollInside(e.target, scroller, e.deltaY)) return

      e.preventDefault()

      const now = performance.now()
      const delta = Math.abs(e.deltaY)
      const fresh = now - lastWheelAt > GESTURE_GAP_MS || delta > lastDelta * 1.5 + 4
      lastWheelAt = now
      lastDelta = delta

      if (animating || !fresh) return
      step(e.deltaY > 0 ? 1 : -1)
    }

    const onKeyDown = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
      if (isEditable(e.target) || isEditable(document.activeElement)) return
      if (overlayOpen()) return

      let direction = 0
      let jump = null
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          direction = 1
          break
        case 'ArrowUp':
        case 'PageUp':
          direction = -1
          break
        case ' ':
          direction = e.shiftKey ? -1 : 1
          break
        case 'Home':
          jump = 0
          break
        case 'End':
          jump = -1
          break
        default:
          return
      }

      e.preventDefault()
      if (jump !== null) {
        if (animating) return
        const sections = getSections()
        if (sections.length) goTo(sections, jump === -1 ? sections.length - 1 : 0)
      } else {
        step(direction)
      }
    }

    // Touch / native scrolling is handled by CSS scroll-snap; just keep track
    // of which section we settled on.
    const onScroll = () => {
      if (animating) return
      clearTimeout(settleTimer)
      settleTimer = setTimeout(syncActive, 120)
    }

    // Section heights follow the viewport, so after a resize (or mobile URL-bar
    // change) re-pin the scroll position to the section the user was on.
    // Native snapping would re-snap to the point nearest the OLD offset, so it
    // stays off until the realigned position has settled.
    const lockSnap = () => {
      scroller.style.scrollSnapType = 'none'
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = requestAnimationFrame(() => {
          scroller.style.scrollSnapType = ''
        })
      })
    }

    // activeIdx is deliberately not recomputed here: the old scroll offset no
    // longer matches the new section positions.
    const realign = () => {
      const sections = getSections()
      if (sections[activeIdx]) scroller.scrollTop = sections[activeIdx].offsetTop
      stableH = scroller.clientHeight
    }

    const onResize = () => {
      tween?.kill()
      tween = null
      animating = false
      realignUntil = performance.now() + REALIGN_WINDOW_MS
      lockSnap()
      realign()
    }

    // ScrollTrigger refreshes itself (debounced) after a resize and puts the old
    // pixel offset back; re-assert the section once it is done.
    const onRefresh = () => {
      if (animating || performance.now() > realignUntil) return
      lockSnap()
      realign()
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    ScrollTrigger.addEventListener('refresh', onRefresh)

    return () => {
      clearTimeout(settleTimer)
      cancelAnimationFrame(resizeRaf)
      tween?.kill()
      scroller.style.scrollSnapType = ''
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      ScrollTrigger.defaults({ scroller: window })
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      id="main-scroller"
      ref={scrollerRef}
      style={{
        height: 'var(--snap-h, 100vh)',
        overflowY: 'scroll',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}
