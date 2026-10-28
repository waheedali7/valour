'use client'

import { forwardRef, useCallback, useEffect, useRef } from 'react'

// Background video that reliably plays whenever it is on screen. The bare
// `autoPlay` attribute only fires once at load, and browsers refuse or pause
// muted autoplay when React omits the `muted` attribute, the video is off-screen,
// the tab was hidden, or the file was still loading. So: mute through the DOM,
// play when it scrolls into view (inside #main-scroller), pause when it leaves,
// and retry on canplay / tab focus / the first user interaction.
const AutoPlayVideo = forwardRef(function AutoPlayVideo(props, ref) {
  const videoRef = useRef(null)

  const setRefs = useCallback(
    (el) => {
      videoRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    },
    [ref]
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    let visible = false

    const play = () => {
      if (!visible || !video.paused) return
      video.play()?.catch(() => {})
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) play()
        else video.pause()
      },
      { root: video.closest('#main-scroller') }
    )
    io.observe(video)

    const onVisibility = () => {
      if (!document.hidden) play()
    }
    const interactions = ['pointerdown', 'touchstart', 'keydown', 'wheel']
    interactions.forEach((type) => window.addEventListener(type, play, { passive: true }))
    video.addEventListener('canplay', play)
    video.addEventListener('pause', play)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      interactions.forEach((type) => window.removeEventListener(type, play))
      video.removeEventListener('canplay', play)
      video.removeEventListener('pause', play)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <video ref={setRefs} autoPlay loop muted playsInline preload="auto" {...props} />
})

export default AutoPlayVideo
