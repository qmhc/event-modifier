<h1 align="center">Event Modifier</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/event-modifier" target="_blank">
    <img src="https://img.shields.io/github/package-json/v/qmhc/event-modifier" alt="npm version"/>
  </a>
</p>

## Usage

```ts
// Also a shortcut alias 'em'
import { eventModifier } from 'event-modifier'

function listener() {
  // do something
}

eventModifier()
  .stop()
  .prevent()
  .keys('Enter', 'Space')
  .apply(listener)
```

## Origin

```vue
<template>
  <div
    tabindex="0"
    @click="handle"
    @keydown.tab="handle"
    @keydown.enter.stop="handle"
    @keydown.space.stop.prevent="handle"
  ></div>
</template>

<script setup>
function handle() {
  // do something
}
</script>
```

Pretty good.

```tsx
function handle() {
  // do something
}

function keyHandle(event: KeyboardEvent) {
  const key = event.code || event.key

  switch (key) {
    case 'Tab': return handle()
    case 'Enter':
      event.stopPropagation()
      return handle()
    case 'Space':
      event.stopPropagation()
      event.preventDefault()
      return handle()
  }
}

function render() {
  return (
    <div tabindex={'0'} onClick={handle} onKeydown={keyHandle}></div>
  )
}
```

Lots of template code, Sad.

## License

All in [MIT](./LICENSE.md) license.
