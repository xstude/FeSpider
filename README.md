# FeSpider

Pull a whole element with css styles from the front page.

## Usage

FeSpider provides two methods, `getMetaData` and `present`, each of which accepts one parameter, an HTML element.

To get your target element, just inspect it and invoke `present` method. When you inspect the target with Chrome dev tool, the element has a reference `$0`. Then type and execute `window.fespider.present($0)` in the console.

That's it.

## Advance

If you want to analyze css file contents to extract `@font-face` information, please set `conf.fetchFont: true`. Then start the server as below to listen to file url fetching requests on port 3663 by default.

```
node server.js
```

## Goodness

Css styles would be optimized. Every tag has just one class name. Tags having the same styles would be the same class.

You say "the class names make no sense"? Come on, nobody cares elements' class names inside a UI component, even you as a developer.
