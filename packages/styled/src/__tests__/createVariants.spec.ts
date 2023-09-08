import { styled } from '../styled'


describe('createVariants', () => {

  describe('core', () => {

    it('should be a function', () => {
      expect(typeof styled.createVariants).toBe('function')
    })

    it('should return base class list', () => {
      const style = styled.createVariants('baseclass')
      expect(style()).toEqual('baseclass')
    })

    it('should deduplicate class list', () => {
      const style = styled.createVariants('outline border outline glow')
      expect(style()).toEqual('outline border glow')
    })

  })

  describe('variants', () => {

    it('should return class list with default variant', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        defaultVariants: {
          size: 'sm',
        },
      })
    
      expect(style()).toEqual('baseclass small')
    })

    it('should return class list with selected variant', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        defaultVariants: {
          size: 'sm',
        },
      })
  
      expect(style({ size: 'lg' })).toEqual('baseclass large')
    })

    it('should return class list with multiple selected variants', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          color: {
            blue: 'blue',
            red: 'red',
          },
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        defaultVariants: {
          size: 'sm',
        },
      })
  
      expect(style({ color: 'blue' })).toEqual('baseclass blue small')
      expect(style({ color: 'red', size: 'lg' })).toEqual('baseclass red large')
    })

  })

  describe('conditional', () => {

    it('should return class list with conditional', () => {

      const style = styled.createVariants('baseclass', {
        conditionals: {
          outline: 'outline',
        },
      })
  
      expect(style({ outline: true })).toEqual('baseclass outline')
      expect(style({ outline: false })).toEqual('baseclass')
    })

    it('should return class list with conditional using function', () => {

      const style = styled.createVariants('baseclass', {
        conditionals: {
          bold: ['bold', 'heavy'],
          outline: (active: boolean) => active ? 'outline' : ['fill border'],
        },
      })

      const expectedDefaultClassList = 'baseclass fill border'
  
      expect(style({ outline: true })).toEqual('baseclass outline')
      expect(style({ outline: false })).toEqual(expectedDefaultClassList)
      expect(style()).toEqual(expectedDefaultClassList)
  
      expect(style({ bold: true })).toEqual('baseclass bold heavy fill border')
      expect(style({ bold: false })).toEqual(expectedDefaultClassList)
      expect(style()).toEqual(expectedDefaultClassList)
    })

  })

  describe('modifiers', () => {

    it('should return class list with modifier', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        conditionals: {
          outline: 'outline',
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            replace: 'custom-small-outline',
          }
        },
      })

      expect(style({ size: 'sm' })).toEqual('baseclass small')
      expect(style({ size: 'lg', outline: true })).toEqual('baseclass large outline')
      expect(style({ size: 'sm', outline: true })).toEqual('baseclass custom-small-outline')
    })

    it('should return class list with single modifier added', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        conditionals: {
          outline: 'outline',
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            add: 'rounded-sm',
          }
        },
      })

      expect(style({ size: 'sm' })).toEqual('baseclass small')
      expect(style({ size: 'lg', outline: true })).toEqual('baseclass large outline')
      expect(style({ size: 'sm', outline: true })).toEqual('baseclass small outline rounded-sm')
    })

    it('should return class list with single modifier removed', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        conditionals: {
          outline: 'outline',
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            remove: 'small',
          }
        },
      })

      expect(style({ size: 'sm' })).toEqual('baseclass small')
      expect(style({ size: 'lg', outline: true })).toEqual('baseclass large outline')
      expect(style({ size: 'sm', outline: true })).toEqual('baseclass outline')
    })

    it('should return class list with modifier removed', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: ['small', 'rounded', 'bg-white'],
            lg: 'large',
          },
        },
        conditionals: {
          outline: 'outline',
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            remove: ['rounded', 'bg-white'],
          }
        },
      })

      expect(style({ size: 'sm' })).toEqual('baseclass small rounded bg-white')
      expect(style({ size: 'lg', outline: true })).toEqual('baseclass large outline')
      expect(style({ size: 'sm', outline: true })).toEqual('baseclass small outline')
    })

    it('should return class list with modifier removed and added', () => {

      const style = styled.createVariants('baseclass', {
        variants: {
          size: {
            sm: ['small', 'rounded', 'bg-white'],
            lg: 'large',
          },
        },
        conditionals: {
          outline: 'outline',
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            remove: ['rounded', 'bg-white'],
            add: ['bright border', 'bg-red'],
          }
        },
      })

      expect(style({ size: 'sm' })).toEqual('baseclass small rounded bg-white')
      expect(style({ size: 'lg', outline: true })).toEqual('baseclass large outline')
      expect(style({ size: 'sm', outline: true })).toEqual('baseclass small outline bright border bg-red')
    })

  })

  describe('class lists', () => {

    it('should render with class lists applied', () => {

      const style = styled.createVariants(['base', 'button'], {
        variants: {
          size: {
            sm: ['small', 'sm'],
            lg: ['large', 'lg'],
          },
        },
        conditionals: {
          outline: ['outline', 'border'],
          contrast: (active: boolean) => active ? ['high-contrast'] : ['low-contrast']
        },
        modifiers: {
          smOutline: {
            variant: 'size:sm',
            prop: 'outline',
            replace: ['small-outline', 'sm-outline'],
          },
        },
      })

      const buttonOne = style({ size: 'lg', outline: true })
  
      expect(buttonOne).toContain('base')
      expect(buttonOne).toContain('button')
      expect(buttonOne).toContain('large')
      expect(buttonOne).toContain('lg')
      expect(buttonOne).toContain('outline')
      expect(buttonOne).toContain('border')
      expect(buttonOne).toContain('low-contrast')

      const buttonTwo = style({ size: 'sm', outline: true, contrast: true })
  
      expect(buttonTwo).toContain('base')
      expect(buttonTwo).toContain('button')
      expect(buttonTwo).toContain('small-outline')
      expect(buttonTwo).toContain('sm-outline')
      expect(buttonTwo).toContain('high-contrast')
    })

  })

})
