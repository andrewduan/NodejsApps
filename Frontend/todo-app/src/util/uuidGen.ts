// Why this????
// UUID was added in via NPM previously, but when I import `import {uuid} from 'uuidv4'`
// then call `uuid()`, it throw `Maximum call stack size exceeded` from `util.js`
// I did a bit search, didn't find a proper way, so copied this in.

// Context, it happens in WebPack v5

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
