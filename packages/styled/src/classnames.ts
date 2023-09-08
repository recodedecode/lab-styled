import {
  ClassList,
  CXResolver,
} from './types'


export const resolveClassNamesFromProps: CXResolver = (
  origProps,
  defaultClassName,
  variants,
  defaultVariants,
  conditionals,
  modifiers,
): [string, Record<string, unknown>] => {

  let classNames: string[] = []
  appendClassNames(classNames, defaultClassName)
  const props = { ...origProps }

  const propsToRemove: string[] = []

  // Apply "replace" modifiers
  Object.entries(modifiers).forEach(([_, modifier]) => {

    const [variantName, variantValue] = modifier.variant.split(':')

    // Get the default variant if one exists
    const defaultVariantName = defaultVariants?.[variantName]
    // Get the variant to use from either the passed in props variant or the default variant
    const selectVariantName = props[variantName] || defaultVariantName
    // Does the select variant equal the modifier value?
    const hasVariantDefined = selectVariantName === variantValue
    const modifierProp = modifier.prop as string
  
    if (hasVariantDefined && props[modifierProp] && modifier?.replace) {
      propsToRemove.push(variantName)
      propsToRemove.push(modifierProp)
      props[variantName] = '__ignore'
      props[modifierProp] = '__ignore'
      appendClassNames(classNames, modifier.replace)
    }
  })

  // Apply variants
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

  // Apply conditionals
  Object.entries(conditionals).forEach(([key, value]) => {

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

  // Apply "add/remove" modifiers
  Object.entries(modifiers).forEach(([_, modifier]) => {

    const [variantName, variantValue] = modifier.variant.split(':')

    // Get the default variant if one exists
    const defaultVariantName = defaultVariants?.[variantName]
    // Get the variant to use from either the passed in props variant or the default variant
    const selectVariantName = props[variantName] || defaultVariantName
    // Does the select variant equal the modifier value?
    const hasVariantDefined = selectVariantName === variantValue
    const modifierProp = modifier.prop as string
    
    if (hasVariantDefined && props[modifierProp] && props[modifierProp] !== '__ignore') {

      if (modifier?.remove) {
        classNames = removeClassNames(classNames, modifier.remove)
      }

      if (modifier?.add) {
        appendClassNames(classNames, modifier.add)
      }
  
    }
  })

  // clean up props

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

const removeClassNames = (list: string[], value: ClassList): string[] => {
  const classListToRemove = Array.isArray(value)
    ? split(value.map(v => v.trim()))
    : split([value.trim()])
  
  const splitList = split(list)
  classListToRemove.forEach(className => {
    for (let i = splitList.length - 1; i >= 0; i --) {
      if (splitList[i] === className) {
        splitList.splice(i, 1)
      }
    }
  })

  return splitList
}

const split = (list: string[]) =>
  list.join(' ').split(' ')

const unique = (classList: string): string =>
  [...new Set(classList.split(' '))].join(' ').trim()

