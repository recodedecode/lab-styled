import { forwardRef, useMemo } from 'react'
import { resolveClassNamesFromProps } from './classnames'
import { domElements } from './constants'
import { CVConfigFunction, CVFunction, Styled } from './types'


const createConfig: CVConfigFunction = (base, variants) => ({
  base,
  variants,
})

const createVariants: CVFunction = (base, config) => (props) => {

  const [classList] = resolveClassNamesFromProps(
    props || {},
    base,
    config?.variants || {},
    config?.defaultVariants || {},
    config?.conditional || {},
    config?.exchange || {},
  )

  return classList
}

export const styled = {
  createConfig,
  createVariants,
} as Styled

domElements.forEach(domElement => {
  // TODO resolve issue with TS overload
  // @eslint-disable-next-line
  // @ts-ignore
  styled[domElement] = (base, config = {}, displayName) => {
    const component = forwardRef(({ children, ...props }, ref) => {

      const Tag = domElement
  
      const [classNames, cleanProps] = useMemo(() => {
        return resolveClassNamesFromProps(
          props || {},
          base,
          config?.variants || {},
          config?.defaultVariants || {},
          config?.conditional || {},
          config?.exchange || {},
        )
      }, [JSON.stringify(props)])
  
      return (
        <Tag
          {...cleanProps}
          className={classNames}
          children={children}
          ref={ref} />
      )
    })

    if (displayName) {
      component.displayName = displayName
    }

    return component
  }
})
