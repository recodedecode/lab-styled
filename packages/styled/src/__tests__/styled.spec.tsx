import React, { createRef } from 'react'
import { render } from '@testing-library/react'
import { styled } from '../styled'


describe('styled', () => {

  const renderFirstChild = (component: React.ReactElement) => {
    const { container } = render(component)
    return container.firstChild
  }

  describe('base classes', () => {

    it('should render a component with a base class applied', () => {
  
      const Button = styled.button('baseclass')

      const { container } = render(<Button />)
      const button = container.querySelector('button')

      expect(button).toBeTruthy()
      expect(button?.classList.length).toEqual(1)
      expect(button).toHaveClass('baseclass')
    })

    it('should render a component with a base class list applied', () => {

      const Button = styled.button('baseclass outline')
      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('outline')
    })

    it('should render a component with a base class array applied', () => {

      const Button = styled.button(['baseclass outline', 'bright'])
      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('outline')
      expect(button).toHaveClass('bright')
    })

  })

  describe('variant classes', () => {

    it('should render variant class', () => {
    
      const Button = styled.button('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          }
        }
      })

      const button = renderFirstChild(<Button size='sm' />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('small')
      expect(button).not.toHaveClass('large')
    })

    it('should not render with class variant if not supplied', () => {

      const Button = styled.button('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          }
        }
      })

      // We are expecting a type error here
      // eslint-disable-next-line
      // @ts-ignore
      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).not.toHaveClass('small')
      expect(button).not.toHaveClass('large')
    })

    it('should not render with default class variant', () => {

      const Button = styled.button('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          }
        },
        defaultVariants: {
          size: 'sm',
        }
      })

      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('small')
      expect(button).not.toHaveClass('large')
    })

  })

  describe('conditional classes', () => {

    it('should render with conditional class applied', () => {

      const Button = styled.button('baseclass', {
        conditional: {
          outline: 'outline',
        }
      })

      const button = renderFirstChild(<Button outline />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('outline')
    })

    it('should render without conditional class applied', () => {

      const Button = styled.button('baseclass', {
        conditional: {
          outline: 'outline',
        }
      })

      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).not.toHaveClass('outline')
    })

    it('should render with conditional primary class applied', () => {

      const Button = styled.button('baseclass', {
        conditional: {
          outline: (active: boolean) => active ? 'outline' : 'fill',
        }
      })

      const button = renderFirstChild(<Button outline />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('outline')
      expect(button).not.toHaveClass('fill')
    })

    it('should render with conditional fallback class applied', () => {

      const Button = styled.button('baseclass', {
        conditional: {
          outline: (active: boolean) => active ? 'outline' : 'fill',
        }
      })

      const button = renderFirstChild(<Button />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).not.toHaveClass('outline')
      expect(button).toHaveClass('fill')
    })

    it('should render with conditional array class list applied', () => {

      const Button = styled.button('baseclass', {
        conditional: {
          outline: ['outline', 'bright'],
        }
      })

      const button = renderFirstChild(<Button outline />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).toHaveClass('outline')
      expect(button).toHaveClass('bright')
    })

  })

  describe('exchange classes', () => {

    it('should render with exchange class applied', () => {

      const Button = styled.button('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        conditional: {
          outline: 'outline',
        },
        exchange: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            with: 'small-outline',
          },
        },
      })

      const button = renderFirstChild(<Button size='sm' outline />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).not.toHaveClass('small')
      expect(button).not.toHaveClass('outline')
      expect(button).toHaveClass('small-outline')
    })

    it('should render with exchange array class list applied', () => {

      const Button = styled.button('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        conditional: {
          outline: 'outline',
        },
        exchange: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            with: ['small-outline', 'bright'],
          },
        },
      })

      const button = renderFirstChild(<Button size='sm' outline />)
  
      expect(button).toHaveClass('baseclass')
      expect(button).not.toHaveClass('small')
      expect(button).not.toHaveClass('outline')
      expect(button).toHaveClass('small-outline')
      expect(button).toHaveClass('bright')
    })

  })

  describe('class lists', () => {

    it('should render with class lists applied', () => {

      const Button = styled.button(['base', 'button'], {
        variants: {
          size: {
            sm: ['small', 'sm'],
            lg: ['large', 'lg'],
          },
        },
        conditional: {
          outline: ['outline', 'border'],
          contrast: (active: boolean) => active ? ['high-contrast'] : ['low-contrast']
        },
        exchange: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            with: ['small-outline', 'sm-outline'],
          },
        },
      })

      const buttonOne = renderFirstChild(<Button size='lg' outline />)
  
      expect(buttonOne).toHaveClass('base')
      expect(buttonOne).toHaveClass('button')
      expect(buttonOne).toHaveClass('large')
      expect(buttonOne).toHaveClass('lg')
      expect(buttonOne).toHaveClass('outline')
      expect(buttonOne).toHaveClass('border')
      expect(buttonOne).toHaveClass('low-contrast')

      const buttonTwo = renderFirstChild(<Button size='sm' outline contrast />)
  
      expect(buttonTwo).toHaveClass('base')
      expect(buttonTwo).toHaveClass('button')
      expect(buttonTwo).toHaveClass('small-outline')
      expect(buttonTwo).toHaveClass('sm-outline')
      expect(buttonTwo).toHaveClass('high-contrast')
    })

  })

  describe('component ref', () => {

    it('should associate component with ref', () => {

      const Button = styled.button('base')
      const ref = createRef<HTMLButtonElement>()
      
      renderFirstChild(<Button ref={ref} />)
  
      expect(ref?.current).toBeTruthy()
      expect(ref?.current?.tagName).toEqual('BUTTON')
    })

  })

  describe('component displayName', () => {

    it('should create component with displayName', () => {

      const UnnamedButton = styled.button('base')
      expect(UnnamedButton.displayName).toBeUndefined()

      const NamedButton = styled.button('base', {}, 'MyButton')
      expect(NamedButton.displayName).toEqual('MyButton')
    })

  })

})
