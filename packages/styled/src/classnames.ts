import {
  ClassList,
  CXResolver,
} from './types'


export const resolveClassNamesFromProps: CXResolver = (
  origProps,
  defaultClassName,
  variants,
  defaultVariants,
  conditional,
  exchange,
): [string, Record<string, unknown>] => {

  const classNames: string[] = []
  appendClassNames(classNames, defaultClassName)
  const props = { ...origProps }

  const propsToRemove: string[] = []

  Object.entries(exchange).forEach(([_, exchange]) => {

    const [variantName, variantValue] = exchange.variant.split(':')

    // Get the default variant if one exists
    const defaultVariantName = defaultVariants?.[variantName]
    // Get the variant to use from either the passed in props variant or the default variant
    const selectVariantName = props[variantName] || defaultVariantName
    // Does the select variant equal the exchange value?
    const hasVariantDefined = selectVariantName === variantValue
    const exchangeProp = exchange.prop as string
  
    if (hasVariantDefined && props[exchangeProp]) {
      propsToRemove.push(variantName)
      propsToRemove.push(exchangeProp)
      props[variantName] = '__ignore'
      props[exchangeProp] = '__ignore'
      appendClassNames(classNames, exchange.with)
    }
  })

  Object.entries(variants).forEach(([variant, values]) => {
    if (props[variant]) {
      Object.entries(values).forEach(([key, value]) => {
        if (props[variant] === key) {
          propsToRemove.push(variant)
          appendClassNames(classNames, value)
        }
      })
    }
    else if (defaultVariants[variant]) {
      const defaultKey = defaultVariants[variant] as string
      const defaultClassNames = variants?.[variant]?.[defaultKey]
      appendClassNames(classNames, defaultClassNames)
    }
  })

  Object.entries(conditional).forEach(([key, value]) => {

    // Determine if the prop is a boolean or undefined
    const isbooleanLike = typeof props[key] == 'boolean' || typeof props[key] === 'undefined'

    if (isbooleanLike && props[key] !== '__ignore') {
  
      const acitve = !! props[key]
      propsToRemove.push(key)

      const classList = typeof value === 'function'
        ? value(acitve)
        : acitve ? value : ''

      if (classList) {
        appendClassNames(classNames, classList)
      }
    }
  })

  propsToRemove.forEach(prop => {
    delete props[prop]
  })

  if (props?.['className']) {
    appendClassNames(classNames, props['className'] as string)
  }

  return [unique(classNames.join(' ')), props]
}

const appendClassNames = (list: string[], value: ClassList) => {
  Array.isArray(value)
    ? list.push(...value.map(v => v.trim()))
    : list.push(value.trim())
}

const unique = (classList: string): string =>
  [...new Set(classList.split(' '))].join(' ').trim()

