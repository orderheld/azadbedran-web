'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Eigene, cookielose Besucherstatistik (siehe app/api/t/route.ts). Rendert nichts.

type Payload = Record<string, unknown>

function send(data: Payload) {
  const body = JSON.stringify(data)
  try {
    if (navigator.sendBeacon?.('/api/t', new Blob([body], { type: 'text/plain' }))) return
  } catch {}
  fetch('/api/t', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(() => {})
}

const rid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)

export default function Analytics() {
  const pathname = usePathname()
  const page = useRef({ pid: '', path: '', visible: 0, since: 0 })
  const firstLoad = useRef(true)

  const activeSeconds = () => {
    const p = page.current
    const extra = document.visibilityState === 'visible' && p.since ? Date.now() - p.since : 0
    return Math.round((p.visible + extra) / 1000)
  }

  // Seitenaufruf bei jedem Seitenwechsel
  useEffect(() => {
    if (/^\/admin/.test(pathname)) return
    const prev = page.current
    if (prev.pid) send({ type: 'ping', pid: prev.pid, path: prev.path, duration: activeSeconds() })

    const params = new URLSearchParams(location.search)
    const pid = rid()
    page.current = { pid, path: pathname, visible: 0, since: document.visibilityState === 'visible' ? Date.now() : 0 }
    send({
      type: 'pageview',
      pid,
      path: pathname,
      referrer: firstLoad.current ? document.referrer : location.origin + prev.path,
      utm: { source: params.get('utm_source') ?? params.get('ref'), medium: params.get('utm_medium'), campaign: params.get('utm_campaign') },
      screen: `${screen.width}x${screen.height}`,
    })
    firstLoad.current = false
  }, [pathname])

  // Live-Signal, Verweildauer, Link-Klicks
  useEffect(() => {
    if (/^\/admin/.test(location.pathname)) return
    const ping = (type: 'ping' | 'leave') => {
      const p = page.current
      if (p.pid) send({ type, pid: p.pid, path: p.path, duration: activeSeconds() })
    }
    const timer = window.setInterval(() => document.visibilityState === 'visible' && ping('ping'), 20000)
    const onVisibility = () => {
      const p = page.current
      if (document.visibilityState === 'hidden') {
        if (p.since) p.visible += Date.now() - p.since
        p.since = 0
        ping('ping')
      } else p.since = Date.now()
    }
    const onHide = () => ping('leave')
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const raw = a.getAttribute('href') ?? ''
      if (!raw || raw.startsWith('#')) return
      const url = new URL(a.href, location.href)
      const external = url.origin !== location.origin
      const label = (a.getAttribute('aria-label') || a.textContent || a.title || '').replace(/\s+/g, ' ').trim().slice(0, 120)
      send({
        type: 'click',
        pid: page.current.pid,
        path: location.pathname,
        target: external || /^(tel|mailto|sms):/.test(url.protocol) ? (url.protocol.startsWith('http') ? url.href : raw) : url.pathname,
        label,
        external: external,
      })
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onHide)
    document.addEventListener('click', onClick, { capture: true })
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onHide)
      document.removeEventListener('click', onClick, { capture: true })
    }
  }, [])

  return null
}
