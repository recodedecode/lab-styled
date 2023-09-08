import { styled } from '../styled'


describe('createConfig', () => {

  describe('core', () => {

    it('should be a function', () => {
      expect(typeof styled.createConfig).toBe('function')
    })

    it('should return styled config object', () => {
  
      const config = styled.createConfig('base', {
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

      const expected = {
        base: 'base',
        variants: {
          variants: {
            size: {
              sm: 'small',
              lg: 'large',
            },
          },
          defaultVariants: {
            size: 'sm',
          },
        },
      }
  
      expect(config).toEqual(expected)
    })

  })

  describe('integration', () => {

    it('should integrate with createVariants', () => {

      const config = styled.createConfig('base', {
        variants: {
          size: {
            sm: 'small',
            lg: 'large',
          },
        },
        defaultVariants: {
          size: 'sm',
        },
        conditionals: {
          outline: 'outline',
        },
      })

      const style = styled.createVariants(config.base, config.variants)
      expect(style()).toEqual('base small')
      expect(style({ size: 'lg', outline: true })).toEqual('base large outline')
    })

  })

})
