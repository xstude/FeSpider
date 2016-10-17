var exec = function (js) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = js;
    var heads = document.getElementsByTagName("head");
    if(heads.length) {
        heads[0].appendChild(script);
    } else {
        document.documentElement.appendChild(script);
    }
};

exec('var feSpider=function (e){console.log(e)};console.log("fespider loaded");var dom = document.createElement("div");dom.id = "123123123";document.body.appendChild(dom);dom.onclick = function () {feSpider(window.$0);};');