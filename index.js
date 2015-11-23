// begin from here
var Page = require('./lib/page');
var _ = require('lodash');
var getComp = require('./getComp');
var u = require('./utils/components');

var defaults = {
    qMark: '<!--isQPage-->',
    classHolder: /___|\$__/g,
    nameHolder: /____|\$__\$/g,
    components: ['/components']
};

function hasQMark(file, conf) {
    var i = (file.getContent() || '').indexOf(conf.qMark);
    return i >= 0 && i < 200;
}

var entry = module.exports = function(ret, conf, settings, opt) {
    // console.log('prepackager-ques begin');
    // console.log('ret', Object.keys(ret) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.src) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.ids) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.pkg) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.map) /*, conf, settings, opt*/ );

    var components = {};
    var f;

    function _getComp(name) {
        var comp = typeof components[name] !== 'undefined' ? components[name] : components[name] = getComp(name, settings.components);
        return comp ? _.extend({}, comp) : null;
    }

    settings = _.extend(settings, defaults, {
        getComp: _getComp
    });

    // console.log(settings, getComp('todoapp', settings.components));
    // html
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isHtmlLike && (file.isQPage || hasQMark(file, settings))) {
            var page = new Page(file.getContent(), file, ret, settings);
            file.setContent(page.html());
        }
    });

    // replace comp holder
    fis.util.map(components, function(name, comp) {
        if (comp) {
            f = ret.src[comp.html];
            if (f) {
                f.setContent(u.fix(f.getContent(), name, settings));
            }
            f = ret.src[comp.css];
            if (f) {
                f.setContent(u.fix(f.getContent(), name, settings));
            }
            f = ret.src[comp.scss];
            if (f) {
                f.setContent(u.fix(f.getContent(), name, settings));
            }
            f = ret.src[comp.less];
            if (f) {
                f.setContent(u.fix(f.getContent(), name, settings));
            }
        }
    });
};
