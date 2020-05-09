class test {
    constructor() {
        let info = this.getBrowserInfo()
        var div = document.createElement('div')
        div.innerHTML = '你看到我了吗？ ' + info + '——' + (new Date).toLocaleTimeString()
        div.style.fontSize = '36px'
        div.style.backgroundColor = '#fff'
        div.style.margin = '5px'
        div.style.padding = '15px'
        document.body.insertBefore(div, document.body.nextSibling)
    }

    getBrowserInfo () {
        var agent = navigator.userAgent.toLowerCase();

        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;

        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie);
        }

        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff);
        }

        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome);
        }

        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf);
        }

        return agent;

    }
}

new test()
