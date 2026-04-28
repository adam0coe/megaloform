describe('test setup', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2)
  })

  it('has access to a jsdom document', () => {
    const div = document.createElement('div')
    div.textContent = 'hello'
    expect(div.textContent).toBe('hello')
  })

  it('has jest-dom matchers wired up', () => {
    const div = document.createElement('div')
    div.textContent = 'visible'
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
    document.body.removeChild(div)
  })
})
