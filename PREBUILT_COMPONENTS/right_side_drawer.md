

## Anatomy



```tsx
<Drawer.Root>
  <Drawer.Trigger />
  <Drawer.Backdrop />
  <Drawer.Positioner>
    <Drawer.Content>
      <Drawer.Grabber>
        <Drawer.GrabberIndicator />
      </Drawer.Grabber>
      <Drawer.Title />
      <Drawer.Description />
      <Drawer.CloseTrigger />
    </Drawer.Content>
  </Drawer.Positioner>
</Drawer.Root>
```

## Examples

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const Basic = () => (
  <Drawer.Root>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Drawer Title</Drawer.Title>
        <p>This is the content of the drawer.</p>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Swipe Direction

Use the `swipeDirection` prop to control which edge the drawer slides in from.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const SwipeDirection = () => (
  <Drawer.Root swipeDirection="end">
    <Drawer.Trigger className={styles.Trigger}>Open Right</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Title className={styles.Title}>Right Drawer</Drawer.Title>
        <p>This drawer slides in from the right side.</p>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Snap Points

Use the `snapPoints` prop to define intermediate positions the drawer can snap to.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const SnapPoints = () => (
  <Drawer.Root snapPoints={[0.25, 0.5, 1]} defaultSnapPoint={0.5}>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Drawer with Snap Points</Drawer.Title>
        <p>This drawer has multiple snap points at 25%, 50%, and 100% of the viewport height.</p>
        <p>Drag the grabber to snap between different heights, or swipe to dismiss.</p>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Modal

Set `modal` to `false` to allow interaction with the rest of the page while the drawer is open.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const Modal = () => (
  <Drawer.Root modal>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Modal Drawer</Drawer.Title>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Controlled

Use the `open` and `onOpenChange` props to control the drawer state.

```tsx
import { Drawer, type DrawerOpenChangeDetails } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import button from 'styles/button.module.css'
import styles from 'styles/drawer.module.css'

export const Controlled = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={button.Root} onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Open'} Drawer
      </button>

      <Drawer.Root open={open} onOpenChange={(details: DrawerOpenChangeDetails) => setOpen(details.open)}>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Positioner className={styles.Positioner}>
          <Drawer.Content className={styles.Content}>
            <Drawer.Grabber className={styles.Grabber}>
              <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
            </Drawer.Grabber>
            <Drawer.Title className={styles.Title}>Controlled Drawer</Drawer.Title>
            <p>This drawer is controlled via state.</p>
            <Drawer.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}
```

### Scrollable

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const Scrollable = () => (
  <Drawer.Root>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Scrollable Drawer</Drawer.Title>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
        <div className={styles.Scrollable}>
          {Array.from({ length: 50 }).map((_, index) => (
            <div key={index} className={styles.ScrollableItem}>
              Item {index + 1}
            </div>
          ))}
        </div>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### No Drag Area

Apply the `data-no-drag` attribute to any element inside the drawer to prevent dragging from starting on it.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const NoDragArea = () => (
  <Drawer.Root>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Drawer Title</Drawer.Title>
        <p data-no-drag>This is the no drag area of the drawer.</p>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Non Draggable

Set `draggable` to `false` to disable drag-to-dismiss entirely.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer.module.css'

export const NonDraggable = () => (
  <Drawer.Root>
    <Drawer.Trigger className={styles.Trigger}>Open</Drawer.Trigger>
    <Drawer.Backdrop className={styles.Backdrop} />
    <Drawer.Positioner className={styles.Positioner}>
      <Drawer.Content className={styles.Content} draggable={false}>
        <Drawer.Grabber className={styles.Grabber}>
          <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
        </Drawer.Grabber>
        <Drawer.Title className={styles.Title}>Drawer Title</Drawer.Title>
        <p>This is the content of the drawer.</p>
        <Drawer.CloseTrigger className={styles.CloseTrigger}>
          <XIcon />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
```

### Indent Background

Use `Drawer.IndentBackground` to create a visual indent effect on the page behind the drawer.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import styles from 'styles/drawer-indent.module.css'

export const IndentBackground = () => (
  <Drawer.Stack>
    <div className={styles.Sandbox}>
      <Drawer.IndentBackground className={styles.IndentBackground} />
      <Drawer.Root modal={false}>
        <Drawer.Indent className={styles.Indent}>
          <div className={styles.IndentCenter}>
            <Drawer.Trigger className={styles.Trigger}>Open Drawer</Drawer.Trigger>
          </div>
        </Drawer.Indent>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Positioner className={styles.Positioner}>
          <Drawer.Content className={styles.Content}>
            <Drawer.Grabber className={styles.Grabber}>
              <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
            </Drawer.Grabber>
            <Drawer.Title className={styles.Title}>Notifications</Drawer.Title>
            <Drawer.Description className={styles.Description}>You are all caught up. Good job!</Drawer.Description>
            <Drawer.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </div>
  </Drawer.Stack>
)
```

### Multiple Triggers

Use the `value` prop on `Drawer.Trigger` to share a single drawer across multiple trigger elements. The
`onTriggerValueChange` callback fires when a different trigger is activated.

```tsx
import { Drawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import button from 'styles/button.module.css'
import styles from 'styles/drawer.module.css'
import field from 'styles/field.module.css'

interface User {
  id: string
  name: string
  email: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
]

export const MultipleTriggers = () => {
  const [activeUser, setActiveUser] = useState<User | null>(null)

  return (
    <Drawer.Root
      swipeDirection="end"
      onTriggerValueChange={(e) => {
        setActiveUser(users.find((u) => u.id === e.value) ?? null)
      }}
    >
      <div className={button.Group}>
        {users.map((user) => (
          <Drawer.Trigger key={user.id} value={user.id} className={button.Root}>
            Edit {user.name}
          </Drawer.Trigger>
        ))}
      </div>
      <Drawer.Backdrop className={styles.Backdrop} />
      <Drawer.Positioner className={styles.Positioner}>
        <Drawer.Content className={styles.Content}>
          <Drawer.Grabber className={styles.Grabber}>
            <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
          </Drawer.Grabber>
          <Drawer.Title className={styles.Title}>Edit User</Drawer.Title>
          {activeUser && (
            <div className="stack">
              <div className={field.Root}>
                <label className={field.Label}>Name</label>
                <input className={field.Input} value={activeUser.name} />
              </div>
              <div className={field.Root}>
                <label className={field.Label}>Email</label>
                <input className={field.Input} value={activeUser.email} />
              </div>
              <div className={button.Group}>
                <Drawer.CloseTrigger className={button.Root}>Cancel</Drawer.CloseTrigger>
                <Drawer.CloseTrigger className={button.Root} data-variant="solid">
                  Save Changes
                </Drawer.CloseTrigger>
              </div>
            </div>
          )}
          <Drawer.CloseTrigger className={styles.CloseTrigger}>
            <XIcon />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}
```

### Using the Root Provider

Use the `useDrawer` hook and `Drawer.RootProvider` to control the drawer from outside the component tree.

```tsx
import { Drawer, useDrawer } from '@ark-ui/react/drawer'
import { XIcon } from 'lucide-react'
import button from 'styles/button.module.css'
import styles from 'styles/drawer.module.css'

export const RootProvider = () => {
  const drawer = useDrawer({
    defaultSnapPoint: 0.5,
    snapPoints: [0.25, 0.5, 1],
  })

  return (
    <div className="stack">
      <div className="hstack">
        <button className={button.Root} onClick={() => drawer.setOpen(true)}>
          Open via API
        </button>
        <button className={button.Root} onClick={() => drawer.setSnapPoint(0.25)}>
          Set to 25%
        </button>
        <button className={button.Root} onClick={() => drawer.setSnapPoint(1)}>
          Set to 100%
        </button>
      </div>

      <Drawer.RootProvider value={drawer}>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Positioner className={styles.Positioner}>
          <Drawer.Content className={styles.Content}>
            <Drawer.Grabber className={styles.Grabber}>
              <Drawer.GrabberIndicator className={styles.GrabberIndicator} />
            </Drawer.Grabber>
            <Drawer.Title className={styles.Title}>Drawer with RootProvider</Drawer.Title>
            <p>This drawer is controlled via the useDrawer hook and RootProvider.</p>
            <p>Active snap point: {drawer.snapPoint}</p>
            <Drawer.CloseTrigger className={styles.CloseTrigger}>
              <XIcon />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.RootProvider>
    </div>
  )
}
```

## Guides

### Styling by Swipe Direction

The `Drawer.Content` elements expose a `data-swipe-direction` attribute (`up` | `down` | `left` | `right`) that reflects
the resolved physical direction the drawer slides in from.

Target it to apply direction-aware styles — for example, rounded corners on the side facing the viewport:

```css
[data-scope='drawer'][data-part='content'] {
  /* Top drawer */
  &[data-swipe-direction='up'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  /* Bottom drawer */
  &[data-swipe-direction='down'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  /* Left drawer */
  &[data-swipe-direction='left'] {
    border-top-left-radius: 0;
    border-bottom-right-radius: 16px;
    border-top-left-radius: 16px;
    border-top-right-radius: 0;
  }

  /* Right drawer */
  &[data-swipe-direction='right'] {
    border-top-right-radius: 0;
    border-bottom-left-radius: 16px;
    border-top-left-radius: 0;
    border-top-right-radius: 16px;
  }
}
```

### Preventing Overdrag Gaps

When a user drags the drawer past its open position, a small gap can appear between the drawer content and the viewport
edge. To prevent this, extend the drawer's background beyond its visible bounds using a CSS `::after` pseudo-element:

```css
[data-scope='drawer'][data-part='content'] {
  --bleed: 3rem;
  position: relative;

  /* Bleed effect */
  &::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: 100%;
    height: var(--bleed);
    background-color: inherit;
    pointer-events: none;
  }
}
```

For side drawers, adjust the pseudo-element to extend horizontally:

```css
[data-scope='drawer'][data-part='content'] {
  /* Right drawer */
  &[data-swipe-direction='right']::after {
    inset-inline: auto;
    inset-block: 0;
    top: 0;
    left: 100%;
    width: var(--bleed);
    height: auto;
  }

  /* Left drawer */
  &[data-swipe-direction='left']::after {
    inset-inline: auto;
    inset-block: 0;
    top: 0;
    right: 100%;
    width: var(--bleed);
    height: auto;
  }
}
```

The `::after` element inherits the drawer's background color and sits just outside the content bounds. During overdrag,
the dampened movement reveals this extension instead of an empty gap.

## API Reference

### Props

### Root

#### Props

**`closeOnEscape`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to close the drawer when the escape key is pressed.

**`closeOnInteractOutside`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to close the drawer when the outside is clicked.

**`closeThreshold`**
Type: `number`
Required: false
Default Value: `0.25`
Description: The threshold distance for dismissing the drawer.

**`defaultOpen`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: The initial open state of the drawer.

**`defaultSnapPoint`**
Type: `SnapPoint`
Required: false
Default Value: `undefined`
Description: undefined

**`defaultTriggerValue`**
Type: `string`
Required: false
Default Value: `undefined`
Description: The default trigger value (uncontrolled).

**`finalFocusEl`**
Type: `() => MaybeElement`
Required: false
Default Value: `undefined`
Description: Element to receive focus when the sheet is closed.

**`hideMode`**
Type: `HideMode`
Required: false
Default Value: `'display-none'`
Description: How to hide content when mounted but not present.
- `'display-none'`: HTML `hidden` attribute. Effects stay alive.
- `'activity'`: React 19 `<Activity mode="hidden">`. Effects pause. Requires React 19+.

**`id`**
Type: `string`
Required: false
Default Value: `undefined`
Description: The unique identifier of the machine.

**`ids`**
Type: `Partial<{
  backdrop: string
  positioner: string
  content: string
  title: string
  description: string
  header: string
  trigger: string | ((value?: string | undefined) => string)
  grabber: string
  grabberIndicator: string
  closeTrigger: string
  swipeArea: string
}>`
Required: false
Default Value: `undefined`
Description: The ids of the elements in the drawer. Useful for composition.

**`immediate`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Whether to synchronize the present change immediately or defer it to the next frame

**`initialFocusEl`**
Type: `() => MaybeElement`
Required: false
Default Value: `undefined`
Description: Element to receive focus when the sheet is opened.

**`lazyMount`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to enable lazy mounting

**`modal`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to prevent pointer interaction outside the element and hide all content below it.

**`onEscapeKeyDown`**
Type: `(event: KeyboardEvent) => void`
Required: false
Default Value: `undefined`
Description: Function called when the escape key is pressed

**`onExitComplete`**
Type: `VoidFunction`
Required: false
Default Value: `undefined`
Description: Function called when the animation ends in the closed state

**`onFocusOutside`**
Type: `(event: FocusOutsideEvent) => void`
Required: false
Default Value: `undefined`
Description: Function called when the focus is moved outside the component

**`onInteractOutside`**
Type: `(event: InteractOutsideEvent) => void`
Required: false
Default Value: `undefined`
Description: Function called when an interaction happens outside the component

**`onOpenChange`**
Type: `(details: OpenChangeDetails) => void`
Required: false
Default Value: `undefined`
Description: Function called when the open state changes.

**`onPointerDownOutside`**
Type: `(event: PointerDownOutsideEvent) => void`
Required: false
Default Value: `undefined`
Description: Function called when the pointer is pressed down outside the component

**`onRequestDismiss`**
Type: `(event: LayerDismissEvent) => void`
Required: false
Default Value: `undefined`
Description: Function called when this layer is closed due to a parent layer being closed

**`onSnapPointChange`**
Type: `(details: SnapPointChangeDetails) => void`
Required: false
Default Value: `undefined`
Description: Callback fired when the snap point changes.

**`onTriggerValueChange`**
Type: `(details: TriggerValueChangeDetails) => void`
Required: false
Default Value: `undefined`
Description: Callback when the active trigger value changes.

**`open`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Whether the drawer is open.

**`present`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Whether the node is present (controlled by the user)

**`preventDragOnScroll`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to prevent dragging on scrollable elements.
When enabled, the sheet will not start dragging if the user is interacting with a scrollable element.

**`preventScroll`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to prevent scrolling behind the sheet when it's opened

**`restoreFocus`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to restore focus to the element that had focus before the sheet was opened.

**`role`**
Type: `'dialog' | 'alertdialog'`
Required: false
Default Value: `"dialog"`
Description: The sheet's role

**`skipAnimationOnMount`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to allow the initial presence animation.

**`snapPoint`**
Type: `SnapPoint`
Required: false
Default Value: `undefined`
Description: The currently active snap point.

**`snapPoints`**
Type: `SnapPoint[]`
Required: false
Default Value: `[1]`
Description: The snap points of the drawer.
Array of numbers or strings representing the snap points.

**`snapToSequentialPoints`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether the drawer should snap to sequential points when swiping.

**`stack`**
Type: `DrawerStack`
Required: false
Default Value: `undefined`
Description: Optional external store for coordinating app-level drawer stack visuals
(e.g. indent and background layers).

**`swipeDirection`**
Type: `SwipeDirection`
Required: false
Default Value: `"down"`
Description: The direction in which the drawer can be swiped.

**`swipeVelocityThreshold`**
Type: `number`
Required: false
Default Value: `700`
Description: The threshold velocity (in pixels/s) for closing the drawer.

**`trapFocus`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether to trap focus inside the sheet when it's opened.

**`triggerValue`**
Type: `string`
Required: false
Default Value: `undefined`
Description: The value of the trigger that currently controls the drawer.

**`unmountOnExit`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to unmount on exit.

### Backdrop

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

#### Data Attributes

**`data-scope`**: drawer
**`data-part`**: backdrop
**`data-state`**: "open" | "closed"
**`data-swiping`**: 

### CloseTrigger

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### Content

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

**`draggable`**
Type: `boolean`
Required: false
Default Value: `true`
Description: Whether the drawer content is draggable.
If false, the drawer can only be dragged by the grabber.

#### Data Attributes

**`data-scope`**: drawer
**`data-part`**: content
**`data-state`**: "open" | "closed"
**`data-expanded`**: Present when expanded
**`data-swipe-direction`**: 
**`data-swiping`**: 
**`data-dragging`**: Present when in the dragging state
**`data-nested-drawer-open`**: 
**`data-nested-drawer-swiping`**: 

### Description

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### GrabberIndicator

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### Grabber

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### IndentBackground

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### Indent

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### Positioner

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

#### Data Attributes

**`data-scope`**: drawer
**`data-part`**: positioner
**`data-state`**: "open" | "closed"
**`data-swipe-direction`**: 

### RootProvider

#### Props

**`value`**
Type: `UseDrawerReturn`
Required: true
Default Value: `undefined`
Description: undefined

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

**`hideMode`**
Type: `HideMode`
Required: false
Default Value: `'display-none'`
Description: How to hide content when mounted but not present.
- `'display-none'`: HTML `hidden` attribute. Effects stay alive.
- `'activity'`: React 19 `<Activity mode="hidden">`. Effects pause. Requires React 19+.

**`immediate`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Whether to synchronize the present change immediately or defer it to the next frame

**`lazyMount`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to enable lazy mounting

**`onExitComplete`**
Type: `VoidFunction`
Required: false
Default Value: `undefined`
Description: Function called when the animation ends in the closed state

**`present`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Whether the node is present (controlled by the user)

**`skipAnimationOnMount`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to allow the initial presence animation.

**`unmountOnExit`**
Type: `boolean`
Required: false
Default Value: `false`
Description: Whether to unmount on exit.

### SwipeArea

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

#### Data Attributes

**`data-scope`**: drawer
**`data-part`**: swipe-area
**`data-state`**: "open" | "closed"
**`data-swiping`**: 
**`data-swipe-direction`**: 
**`data-disabled`**: Present when disabled

### Title

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

### Trigger

#### Props

**`asChild`**
Type: `boolean`
Required: false
Default Value: `undefined`
Description: Use the provided child element as the default rendered element, combining their props and behavior.

**`value`**
Type: `string`
Required: false
Default Value: `undefined`
Description: The value that identifies this specific trigger

#### Data Attributes

**`data-scope`**: drawer
**`data-part`**: trigger
**`data-value`**: The value of the item
**`data-state`**: "open" | "closed"
**`data-current`**: Present when current

### Context

**API:**

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Whether the drawer is open. |
| `dragging` | `boolean` | Whether the drawer is currently being dragged. |
| `triggerValue` | `string | null` | The value of the active trigger. |
| `setTriggerValue` | `(value: string | null) => void` | Set the active trigger value. |
| `setOpen` | `(open: boolean) => void` | Function to open or close the menu. |
| `snapPoints` | `SnapPoint[]` | The snap points of the drawer. |
| `swipeDirection` | `SwipeDirection` | The swipe direction of the drawer. |
| `snapPoint` | `SnapPoint | null` | The currently active snap point. |
| `setSnapPoint` | `(snapPoint: SnapPoint | null) => void` | Function to set the active snap point. |
| `getOpenPercentage` | `() => number` | Get the current open percentage of the drawer. |
| `getSnapPointIndex` | `() => number` | Get the index of the currently active snap point. |
| `getContentSize` | `() => number | null` | Get the current main-axis size of the drawer content. |


## Accessibility

Complies with the [Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**`Enter`**
Description: When focus is on the trigger, opens the dialog.

**`Tab`**
Description: Moves focus to the next focusable element within the content. Focus is trapped within the dialog.

**`Shift + Tab`**
Description: Moves focus to the previous focusable element. Focus is trapped within the dialog.

**`Esc`**
Description: Closes the dialog and moves focus to trigger or the defined final focus element