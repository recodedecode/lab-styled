# Styled - React classNames

This is a small library for composing variants, conditionals and modifier class names on React components.

This project was inspired by the [Class Variance Authority](https://github.com/joe-bell/cva) and [Windstich](https://windstitch.vercel.app/) libraries. It varries from these in its API design by not only enabling variants but also conditionals and modifier configuration which provide a uniquely powerful way to handle complex edge cases.

This library exposes methods for creating and invoking class names as functions or as React components.

There is good typescript support across both the configuration of variants and the invocation either functionally or as a React component.


# React Examples

### Basic Variants

To add variants simply configure the styled element with one or more variant objects. If you do not set the `defaultVariants` you must declare the value on the component. If you declare an incorrect value or not value you will get type safety warnings.

```typescript
// Button.tsx
import { styled, s } from '@recodedecode/styled'


export type ButtonProps = s.Infer<typeof Button>

export const Button = styled.button('button', {
  variants: {
    size: {
      sm: 'small',
      md: 'medium',
      lg: 'large',
    },
  }
})

// App.tsx
const App = () => (
  <Button size="sm">Click Me</Button> // classNames = "button small"
)

```

### Default Variants and Conditionals

To set default variants supply the right variant name and value in the `defaultVariants` property. You will get type safety warnings if you apply the wrong values here. For any variant that does not have a `defaultVariant`` applied you must explicity define it when declaring the component or you will get type safety errors. 

You can also supply `conditional` properties that are only applied when declared with a boolean value. These can be configured with a string that will be applied if the property is true. You can also configure a function that enables a fallback class to be applied should you need.

```typescript
// Button.tsx
import { styled, s } from '@recodedecode/styled'


export type ButtonProps = s.Infer<typeof Button>

export const Button = styled.button('button', {
  variants: {
    color: {
      blue: 'blue',
      red: 'red',
    },
    size: {
      sm: 'small',
      md: 'medium',
      lg: 'large',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  conditionals: {
    outline: 'outline',
    contrast: (active: boolean) => active ? 'high-contrast' : 'low-contrast',
  },
})

// App.tsx
const App = () => (
  <>
    <Button color="red" size="lg" contrast>Click Me</Button> // classNames = "button red large high-contrast"
    <Button color="blue" outline>Click Me</Button> // classNames = "button blue medium outline low-contrast"
  </>
)
```

### Modifiers

There are some *edge cases* where you may find yourself needing to *add, remove or replace* classes. This may be due to a complex design problem or a conflict in classes themselves. In these cases you can use the modifiers configuration.

The order of operation is deterministic and happens as per the below:

* `replace` - an *optional* (`string | string[]`) property that will remove all existing classes and replace those values with those listed here.
* `remove` - an *optional* (`string | string[]`) propery that will remove any listed classes from the existing class list.
* `add` - an *optional* (`string | string[]`) property that will add new classes to the existing class list.

Modifiers *should be used sparingly* on edge cases. These can easily over complicate your component design for other developers. If you find yourself using this too often you should reconsider how you're building your components.

```typescript
// Button.tsx
import { styled, s } from '@recodedecode/styled'


export type ButtonProps = s.Infer<typeof Button>

export const Button = styled.button('button', {
  variants: {
    size: {
      sm: 'small',
      md: 'medium',
      lg: 'large',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  conditionals: {
    outline: 'outline',
  },
  modifiers: {
    smOutline: {
      variant: 'size:sm',
      prop: 'outline',
      replace: 'small-outline',
    }
  }
})

// App.tsx
const App = () => (
  <Button size="sm" outline>Click Me</Button> // classNames = "button small-outline"
)
```

### Class value types

You can apply a simple string value or an array of strings anywhere a class is expected. This can be helpful when you want to break up overly large class lists across multiple lines. Below is a contrived example of how you can configure things.

```typescript
// Button.tsx
import { styled, s } from '@recodedecode/styled'


export type ButtonProps = s.Infer<typeof Button>

export const Button = styled.button([
  'inline-flex items-center justify-center',
  'rounded-sm text-sm font-medium ring-offset-background transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50 gap-2',
], {
  variants: {
    intent: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    size: {
      sm: 'h-7 px-3 text-xs',
      md: ['h-9 px-3'],
      lg: ['h-10', 'px-4 py-2'],
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
  conditionals: {
    outline: ['outline'],
    contrast: (active: boolean) => active ? ['bright'] : ['dim'],
    rounded: 'rounded-full',
  },
  modifiers: {
    smOutline: {
      variant: 'size:sm',
      prop: 'outline',
      replace: [
        'bg-transparent border border-primary',
        'text-primary',
      ],
    }
  }
})

// App.tsx
const App = () => (
  <Button size="sm" outline>Click Me</Button> // classNames = "button small-outline"
)
```

# Function Examples

You can use the styled functions independent of React. This can be helpful if you are mixing or sharing styles across components or libraries such as [Radix UI](https://www.radix-ui.com/).

### Create Config

Use this to create a compliant style configuration with typescript support.

```typescript
import { styled } from '@recodedecode/styled'


const config = styled.createConfig('button-base', {
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
  modifiers: {
    smOutline: {
      variant: 'size:sm',
      prop: 'outline',
      replace: 'small-outline',
    },
  },
})

// Use with createVariants
const style = styled.createVariants(config.base, config.variants)
```

### Create Variants

Use this to create the variant function that can be invoked with appropriate arguments to get the corresponding class list. You will get typescript warnings as you would with the react component implementation. You must supply arguments that do not have their `defaultVariants` explicity set and values that are not listed will result in type check errors.

```typescript
import { styled } from '@recodedecode/styled'


const style = styled.createVariants('base', {
  variants: {
    size: {
      sm: 'small',
      lg: 'large',
    },
  },
  conditionals: {
    outline: 'outline',
  }
})


const classList = style({ size: 'sm', outline: true })

// classList = "base small outline"
```

### Create Config & Variants

With the above two functions we can create shareable class variant methods.


```typescript
// button.config.ts
import { styled, s } from '@recodedecode/styled'


export const buttonStyleConfig = styled.createConfig('button-base', {
  variants: {
    size: {
      sm: 'small',
      md: 'medium',
      lg: 'large',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  conditionals: {
    outline: 'outline',
  }
})

const style = styled.createVariants(
  buttonStyleConfig.base,
  buttonStyleConfig.variants,
)

const classList = style({ size: 'sm' })
// classList = "button-base small"


// Button.tsx
import { buttonStyleConfig as config } from './button.config'


export type ButtonProps = s.Infer<typeof Button>

export const Button = styled.button(config.base, config.variants)

// App.tsx
const App = () => (
  <Button size="lg" outline>Click Me</Button> // classNames = "button-base large outline"
)

```
