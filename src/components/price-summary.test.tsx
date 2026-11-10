import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PriceSummary } from '@/components/price-summary'

describe('PriceSummary', () => {
  it('muestra noches, tarifa y el total de la estancia', () => {
    render(<PriceSummary roomName="Deluxe Jacuzzi" nights={3} rate={150000} guests={2} />)
    expect(screen.getByRole('heading', { name: 'Deluxe Jacuzzi' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByTestId('total').textContent).toMatch(/450[.\s\u00a0\u202f]?000/)
    expect(screen.getByText(/3 noches/)).toBeInTheDocument()
  })
})
