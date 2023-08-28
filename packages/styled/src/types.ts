import { ElementType, ForwardRefExoticComponent, JSX, RefAttributes } from 'react'
import { domElements } from './constants'


export type ClassList = string | string[]

type ConditionalClassEvaluator = (active: boolean) => ClassList

type ConditionalClassConfig = Record<string, ClassList | ConditionalClassEvaluator>

type VariantClassConfig = Record<string, Record<string, ClassList>>

type DefaultVariantClassConfig<T extends VariantClassConfig> = Partial<{
  [K in keyof T]: keyof T[K]
}>

type VariantClassKey<T extends VariantClassConfig> = {
  // eslint-disable-next-line
  // @ts-ignore
  [K in keyof T]: `${K}:${keyof T[K]}`
}[keyof T]

type ExchangeClassConfig<T extends VariantClassConfig, OptionalProps extends ConditionalClassConfig | undefined> = {
  [key: string]: {
    variant: VariantClassKey<T>
    prop: keyof OptionalProps
    with: ClassList
  }
}

interface ClassConfig<
  Variants extends VariantClassConfig = NonNullable<unknown>,
  DefaultVariants extends DefaultVariantClassConfig<Variants> = NonNullable<unknown>,
  Conditionals extends ConditionalClassConfig = NonNullable<unknown>,
  Exchange extends ExchangeClassConfig<Variants, Conditionals> = NonNullable<unknown>,
> {
  variants?: Variants
  defaultVariants?: DefaultVariants
  conditional?: Conditionals
  exchange?: Exchange
}

type ValidateConditionals<Conditionals extends ConditionalClassConfig> = {
  [Key in keyof Conditionals]?: boolean | undefined
}

type GetVariantIntersectionKeys<T, K extends keyof any> = {
  [k in keyof T]: K extends k ? K : never
}[keyof T]

type CreateOptionalVariants<Props, DefaultVariants> = Partial<
  Pick<Props, GetVariantIntersectionKeys<Props, keyof DefaultVariants>>
>

type ValidateVariants<Variants extends VariantClassConfig> = {
  [Prop in keyof Variants]: Variants[Prop] extends Record<string, ClassList>
    ? keyof Variants[Prop]
    : Variants[Prop] extends (...args: any) => any
      ? Parameters<Variants[Prop]>[0]
      : never
}

type ValidateVariantsWithDefaults<
  Variants extends VariantClassConfig,
  DefaultVariants extends DefaultVariantClassConfig<Variants>,
> = Omit<ValidateVariants<Variants>, keyof DefaultVariants> &
  CreateOptionalVariants<ValidateVariants<Variants>, DefaultVariants>

type StyledProps<
  Variants extends VariantClassConfig,
  DefaultVariants extends DefaultVariantClassConfig<Variants>,
  Conditionals extends ConditionalClassConfig,
> = ValidateVariantsWithDefaults<Variants, DefaultVariants>
  & ValidateConditionals<Conditionals>

export type CVFunction = <
  Variants extends VariantClassConfig = NonNullable<unknown>,
  DefaultVariants extends DefaultVariantClassConfig<Variants> = NonNullable<unknown>,
  Conditionals extends ConditionalClassConfig = NonNullable<unknown>,
  Exchange extends ExchangeClassConfig<Variants, Conditionals> = NonNullable<unknown>,
>(
  base: ClassList,
  config?: ClassConfig<Variants, DefaultVariants, Conditionals, Exchange>,
) => (props?: StyledProps<Variants, DefaultVariants, Conditionals>) => string

export type CVConfigFunction = <
  Variants extends VariantClassConfig = NonNullable<unknown>,
  DefaultVariants extends DefaultVariantClassConfig<Variants> = NonNullable<unknown>,
  Conditionals extends ConditionalClassConfig = NonNullable<unknown>,
  Exchange extends ExchangeClassConfig<Variants, Conditionals> = NonNullable<unknown>,
>(
  base: ClassList,
  config: ClassConfig<Variants, DefaultVariants, Conditionals, Exchange>,
) => {
  base: ClassList,
  variants: ClassConfig<Variants, DefaultVariants, Conditionals, Exchange>,
}

export type CXResolver = <
  Variants extends VariantClassConfig,
  DefaultVariants extends DefaultVariantClassConfig<Variants>,
  Conditionals extends ConditionalClassConfig,
  Exchange extends ExchangeClassConfig<Variants, Conditionals>,
>(
  originProps: Record<string, unknown>,
  base: ClassList,
  variants: Variants,
  defaultVariants: DefaultVariants,
  conditional: Conditionals,
  exchange: Exchange,
) => [string, Record<string, unknown>]

// Forked types from https://github.com/vinpac/windstitch
type InferAnyComponentProps<T> = T extends ElementType<infer Props> ? Props : T

type ToIntrinsicElementIfPossible<As> = As extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[As]
  : As

type CompProps<DefaultAs extends ElementType> = Partial<
  InferAnyComponentProps<ToIntrinsicElementIfPossible<DefaultAs>>
>
// End of forked types form https://github.com/vinpac/windstitch

type StyledTagFunction <
  Element extends keyof JSX.IntrinsicElements,
> = <
  Variants extends VariantClassConfig = NonNullable<unknown>,
  DefaultVariants extends DefaultVariantClassConfig<Variants> = NonNullable<unknown>,
  Conditionals extends ConditionalClassConfig = NonNullable<unknown>,
  Exchange extends ExchangeClassConfig<Variants, Conditionals> = NonNullable<unknown>,
>
  (
    base: ClassList,
    config?: ClassConfig<Variants, DefaultVariants, Conditionals, Exchange>,
    displayName?: string
  ) => ForwardRefExoticComponent<
    JSX.IntrinsicElements[Element]
    & RefAttributes<HTMLElement>
    & StyledProps<Variants, DefaultVariants, Conditionals>
    & CompProps<Element>
  >

type AsKeys = typeof domElements[number]

type AS = Extract<keyof JSX.IntrinsicElements, AsKeys>

type StyledHelpers = {
  createConfig: CVConfigFunction
  createVariants: CVFunction
}

type StyledTags = {
  [DefaultAs in AS]: StyledTagFunction<DefaultAs>
}

export type Styled = StyledHelpers & StyledTags

type ComponentProps<
  Element extends keyof JSX.IntrinsicElements,
  Variants extends VariantClassConfig,
  DefaultVariants extends DefaultVariantClassConfig<Variants>,
  Conditionals extends ConditionalClassConfig,
> = ValidateVariantsWithDefaults<Variants, DefaultVariants>
  & ValidateConditionals<Conditionals>
  & JSX.IntrinsicElements[Element]

export type Infer<T> = T extends ComponentProps<
  infer Element,
  infer Variants,
  infer DefaultVariants,
  infer Conditionals
>
  ? ComponentProps<Element, Variants, DefaultVariants, Conditionals>
  : InferAnyComponentProps<T>;
