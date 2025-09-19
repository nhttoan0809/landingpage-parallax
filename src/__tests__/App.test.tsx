/// <reference types="vitest" />

import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { LenisProvider } from '../lib/lenis'
import App from '../App'

describe('App layout', () => {
  const renderApp = () =>
    render(
      <HelmetProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </HelmetProvider>,
    )

  it('renders hero headline copy', () => {
    renderApp()
    expect(
      screen.getByRole('heading', {
        name: /craft a scroll-driven tale/i,
      }),
    ).toBeInTheDocument()
  })

  it('exposes navigation anchors for each section', () => {
    renderApp()
    const navButtons = links()
    expect(navButtons).toHaveLength(5)
  })
})

const links = () => screen.getAllByRole('button', { name: /intro|story|features|gallery|join/i })
