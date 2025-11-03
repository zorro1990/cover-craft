import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders button with different variants', () => {
    render(<Button variant="outline">Outline Button</Button>)
    expect(screen.getByText('Outline Button')).toBeInTheDocument()
  })

  it('renders button with different sizes', () => {
    render(<Button size="sm">Small Button</Button>)
    expect(screen.getByText('Small Button')).toBeInTheDocument()
  })
})
