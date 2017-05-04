# FeSpider

Pull a whole element with css styles from the front page.

## Usage

FeSpider provides a chrome devtool extension, namely a `.crx` file, and a server-side (Nodejs) script. With the extension installed, a side panel named "FeSpider" in the "Elements" panel is ready.

Just inspect the element to be pulled out, select some options, and run it.

![inspect](https://raw.githubusercontent.com/shenfe/FeSpider/master/readme_assets/1.png)

![pull](https://raw.githubusercontent.com/shenfe/FeSpider/master/readme_assets/2.png)

![review](https://raw.githubusercontent.com/shenfe/FeSpider/master/readme_assets/3.png)

That's it.

## Advance

If you want to analyze css file contents to extract information such as `@font-face`, please set `conf.fetchFont: true`. Then start the server as below to listen to file url fetching requests on port 3663 by default.

```
node server.js
```

or in the project root directory:

```
npm start
```

## Benefit

Css styles would be optimized. Every tag has just one class name. Tags having the same styles would be the same class.

You say "the class names make no sense"? Well, nobody cares elements' class names inside a UI component, even you as a developer.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, [shenfe](https://github.com/shenfe)
