# FeSpider

Pull a whole element with css styles from the front page.

## Usage

FeSpider provides two methods, `getMetaData` and `present`, each of which accepts an HTML element as the first parameter.

To get your target element, just inspect it and invoke `present` method. When you inspect the target with Chrome dev tool, the element has a reference `$0`. Then type and execute `window.fespider.present($0)` in the console. The `present` method also accepts the 2nd parameter (a module name) and the 3rd parameter (options to override the configuration).

```
fespider.present($0);
fespider.present($0, 'my-module');
fespider.present($0, 'my-module', {
    fetchFont: true, // whether to fetch the @font-face rules in css files or not
    serverHost: 'http://127.0.0.1:3663', // the server host
    pullContent: true, // whether to post and save the target content to the server side or not
    generateType: 'html' // the content type to save to the server side, such as: 'html', 'vue'
});
```

That's it.

## Advance

If you want to analyze css file contents to extract `@font-face` information, please set `conf.fetchFont: true`. Then start the server as below to listen to file url fetching requests on port 3663 by default.

```
node server.js
```

## Goodness

Css styles would be optimized. Every tag has just one class name. Tags having the same styles would be the same class.

You say "the class names make no sense"? Come on, nobody cares elements' class names inside a UI component, even you as a developer.
