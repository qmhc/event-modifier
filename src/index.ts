type Process<E extends Event = Event> = (event: E, listener: (event: E) => any, ...args: any[]) => void

export interface EventModifier {
  apply: <E extends Event = Event, R = void>(listener: (event: E) => R) => R,

  stop: () => this,
  prevent: () => this,
  self: () => this,

  left: () => this,
  middle: () => this,
  right: () => this,

  ctrl: () => this,
  shift: () => this,
  alt: () => this,
  meta: () => this,
  exact: () => this,

  keys: (...keys: string[]) => this,
  keysAll: (...keys: string[]) => this
}

const guards = new Map<string, Process<any>>()

function createGuard<E extends Event = Event>(name: string, creator: Process<E>) {
  if (guards.has(name)) return

  guards.set(name, creator)
}

export function eventModifier() {
  const argsRecord = new Map<string, any[]>()
  const modifiers: Record<string, unknown> = Object.create(null)

  for (const [name] of guards) {
    modifiers[name] = (...args: any[]) => {
      argsRecord.set(name, args)
      return modifiers
    }
  }

  modifiers.apply = <E extends Event = Event, R = void>(listener: (event: E) => R) => {
    return (event: E) => {
      for (const [name, args] of argsRecord) {
        if (guards.get(name)?.(event, listener, ...args)) {
          return
        }
      }

      return listener(event)
    }
  }

  return modifiers as unknown as EventModifier
}

export { eventModifier as em }

createGuard('stop', e => e.stopPropagation())
createGuard('prevent', e => e.preventDefault())
createGuard('self', e => e.target !== e.currentTarget)

createGuard('left', e => 'button' in e && (e as MouseEvent).button !== 0)
createGuard('middle', e => 'button' in e && (e as MouseEvent).button !== 1)
createGuard('right', e => 'button' in e && (e as MouseEvent).button !== 2)

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'] as const

createGuard('ctrl', e => !(e as MouseEvent).ctrlKey)
createGuard('shift', e => !(e as MouseEvent).shiftKey)
createGuard('alt', e => !(e as MouseEvent).altKey)
createGuard('meta', e => !(e as MouseEvent).metaKey)
createGuard('exact', e => systemModifiers.some(m => (e as MouseEvent)[`${m}Key`]))

createGuard(
  'keys',
  (e: KeyboardEvent, _, ...keys: string[]) => {
    const currentKey = (e.code || e.key).toLocaleLowerCase()
    let result = true

    for (const key of keys) {
      if (currentKey === key.toLocaleLowerCase()) {
        result = false
        break
      }
    }

    return result
  }
)
createGuard(
  'keysAll',
  (e: KeyboardEvent, _, ...keys: string[]) => {
    const currentKey = (e.code || e.key).toLocaleLowerCase()

    for (const key of keys) {
      if (currentKey !== key.toLocaleLowerCase()) {
        return true
      }
    }

    return false
  }
)
