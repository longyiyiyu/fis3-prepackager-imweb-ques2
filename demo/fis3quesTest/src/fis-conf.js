/* global fis */
var fs = require('fs');
var projConf = {
    "subPath": "mobilev2",
    "cdnRoot": {
        "js": "7.url.cn/edu",
        "css": "7.url.cn/edu",
        "img": "9.url.cn/edu"
    },
    "htdocs": "ke.qq.com",
    "packSrc": []
};

fis.set('project.md5Connector', '.');
fis.set('project.ext', {
    scss: 'css',
    tpl: 'js',
    ascss: 'js',
    acss: 'js'
});
fis.hook('commonjs');
fis.hook('lego', {
    ignore: ['tvp']
});

fis.match('**/_*.scss', {
        release: false
    })
    .match('**.md', {
        release: false
    })
    .match('package.json', {
        release: false
    })
    .match('MIT-LICENSE', {
        release: false
    })
    .match('*.bak*', {
        release: false
    })
    // .match('lego_modules/**/*.html', {
    //     release: false
    // })
    .match('lego_modules/**.min.js', {
        release: false
    })
    .match('lego_modules/**tests', {
        release: false
    })

    .match(/\/(.+)\.tpl$/, {    // js 模版一律用 .tpl
        isMod: true,
        rExt: 'js',
        id: '$1.tpl',
        moduleId: '$1.tpl', // 官方文档说moduleId默认是等于id，其实是骗人的，看源码发现是id去掉ext
        release: '$0.js',
        parser: fis.plugin('imweb-tpl')
    })
    .match(/^\/modules\/(.+)\.tpl$/, { // 简化 modules 引用
        id: '$1.tpl',
        moduleId: '$1.tpl'
    })

    .match(/^\/(pages\/.+)\.js$/, {
        isMod: true,
        id: '$1'
    })
    // 简化 modules 引用
    // modules/index/tupu/index.js -> require('index/tupu/index');
    .match(/^\/modules\/(.+)\.js$/, {
        isMod: true,
        id: '$1'
    })
    // 简化 modules 引用
    // modules/index/tupu/tupu.js -> require('index/tupu');
    .match(/^\/modules\/((?:[^\/]+\/)*)([^\/]+)\/\2\.(js)$/i, {
        //isMod: true, // 不需要，因为匹配这个的也一定匹配上面那个
        id: '$1$2'
    })
    .match(/^\/lego_modules\/(.+)\.js$/i, {
        isMod: true,
        id: '$1'
    })

    ///////////////////// qjs ////////////////////////////////
    // 指定Q，Qjs应该要放到lego里面的，这里先手动指定
    // .match('modules/common/Q.zepto.js', {
    //     id: 'Q'
    // })
    .match('/*.html', {
        isQPage: true
    })
    .match(/^\/(components\/.+)\.js$/, {
        isMod: true,
        id: '$1'
    })
    ///////////////////// qjs ////////////////////////////////

    // .match('partials/**.js', {
    //     isMod: false
    // })
    .match(/(mod|badjs|bj-report)\.js$/, {
        isMod: false
    })
    .match('**.inline.js', {
        isMod: false
    })
    .match('**.{scss,sass}', {
        parser: fis.plugin('sass', {
            include_paths: ['modules/common']
            // include_paths: ['modules/common/sass']
        }),
        rExt: '.css'
    })
    .match(/\/(.+\.async)\.(scss|css)$/, {    // 异步 css 包裹
        isMod: true,
        // rExt: 'js',
        isCssLike: true,
        id: '$1.$2',
        moduleId: '$1.$2',
        release: '$1.$2',
        extras: {
            wrapcss: true
        }
    })
    .match(/^\/modules\/(.+\.async)\.(scss|css)$/, { // 简化 modules 引用
        id: '$1.$2',
        moduleId: '$1.$2'
    })
    // .match('pages/**.js', {
    //     isMod: true
    // })
    .match('**inline.js', {
        isMod: false
    })
    // .match(/^\/pages\/([^\\\/])\/(index|main)\.(html?)/, {
    //     release: '$1.html'
    // })
    .match('*.{html,js}', {
        useSameNameRequire: true
    })
    .match('**.html', {
        // 内置__uri方法
        useDomain: true,
        domain: 'http://' + projConf.htdocs + '/' + projConf.subPath
    })
    .match('**.{js,tpl}', {
        domain: 'http://' + projConf.cdnRoot.js + '/' + projConf.subPath
    })
    .match('**.{css,scss,sass}', {
        domain: 'http://' + projConf.cdnRoot.css + '/' + projConf.subPath
    })
    .match('::image', {
        domain: 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath
    })
    .match('**.ttf', {
        domain: 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath
    })
    .match('::package', {
        prepackager: [fis.plugin('csswrapper'), fis.plugin('imweb-ques', {
            libs: ['common', 'zepto', 'qqapi']
        })],
        // postpackager: fis.plugin('loader', {
        //     resourceType: 'mod',
        //     // obtainScript: false,
        //     useInlineMap: true // 资源映射表内嵌
        // })
        packager: fis.plugin('smart', {
            cssInline: true,
            ignore: ['tvp']
        })
    });


/**
 * 开发
 */
fis.media('dev')
    .match('*', {
        deploy: fis.plugin('local-deliver', {
            to: '../dev'
        })
    })
    .match('::package', {
        packager: fis.plugin('smart', {
            autoPack: true
        })
        // postpackager: fis.plugin('loader', {
        //     resourceType: 'mod',
        //     // obtainScript: false,
        //     allInOne: true,
        //     useInlineMap: true // 资源映射表内嵌
        // })
    });


/**
 * 发布
 *  压缩、合并、文件指纹
 */
fis.media('dist')
    .match('**.{js,tpl}', {
        optimizer: fis.plugin('uglify-js'),
        useHash: true
    })
    .match('**.{css,scss,sass}', {
        optimizer: fis.plugin('clean-css'),
        useHash: true
    })
    .match('**.png', {
        optimizer: fis.plugin('png-compressor')
    })
    .match('::image', {
        useHash: true
    })
    .match('::package', {
        packager: fis.plugin('smart', {
            autoPack: true
        })
        // postpackager: fis.plugin('loader', {
        //     resourceType: 'mod',
        //     // obtainScript: false,
        //     allInOne: true,
        //     useInlineMap: true // 资源映射表内嵌
        // })
    })
    .match('*', {
        deploy: [fis.plugin('local-deliver', {
            to: '../dist'
        })/*, fis.plugin('offpack', {
            to: '../pack',
            packImg: false,
            httpPrefix: {
                html: 'http://' + projConf.htdocs + '/' + projConf.subPath,
                js: 'http://' + projConf.cdnRoot.js + '/' + projConf.subPath,
                css: 'http://' + projConf.cdnRoot.css + '/' + projConf.subPath,
                image: 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath
            },
            ignore: []
        })*/]
    });

// fis.config.set('project.exclude', /((?:^|\/)_.*\.(?:scss))|(.*\.inline\.html)|(fonts\/.*\.css)/i);

// fis.config.merge({
//     modules: {
//         parser: {
//             scss: 'sass',
//             tpl: 'imweb-tpl'
//         },
//         preprocessor: {
//             js: [
//                 'components',
//                 require('../plugins/postprocessor-lego-require')
//             ],
//             html : [require('../plugins/postprocessor-lego-require')]
//         },
//         postprocessor: {
//             js: "jswrapper, require-async",
//             html: "require-async",
//             tpl: "jswrapper",
//             'tpl.js': "jswrapper"
//         },
//         //postpackager : ['autoload', 'simple']
//         prepackager: ['csswrapper'], //{'ousiri-spm-build':{'pkg/zepto.min.js':['zepto']}},
//         postpackager: ['ousiri-async-build', 'ousiri-add-content'],
//         deploy: ['default', 'delete-unused-images']
//     },
//     pack: {}
// });

// fis.config.merge({
//     roadmap: {
//         ext: {
//             scss: 'css',
//             tpl: 'js',
//             ascss: 'js',
//             acss: 'js'
//         },
//         domain: {
//             "**.js": 'http://' + projConf.cdnRoot.js + '/' + projConf.subPath,
//             "**.css": 'http://' + projConf.cdnRoot.css + '/' + projConf.subPath,
//             "**.scss": 'http://' + projConf.cdnRoot.css + '/' + projConf.subPath,
//             "**.tpl": 'http://' + projConf.cdnRoot.js + '/' + projConf.subPath,
//             "**.png": 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath,
//             "**.gif": 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath,
//             "**.jpg": 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath,
//            "**.ttf": 'http://' + projConf.cdnRoot.img + '/' + projConf.subPath,
//                         // "**.ttf": 'http://' + projConf.htdocs + '/' + projConf.subPath,
//             "**.html": 'http://' + projConf.htdocs + '/' + projConf.subPath
//                 //"**.html": 'http://www.qq.com/mobile'
//         },
//         path: [{
//                 reg: '/img/icon-152.png',
//                 useHash: false
//             // }, {
//             //     reg: '/fonts/**',
//             //     useHash: false
//             }, {
//                 reg: '/h5components/**',
//                 useHash: false
//             }, {
//                 reg: projConf.jsNoWrap || '**/mod.js',
//                 isMod: false
//             }, {
//                 reg: '**.html',
//                 useDomain: true
//             }, {
//                 reg: /^\/modules\/(.*)\.async\.(css|scss)$/i,
//                 isMod: true,
//                 id: '$1.async.$2',
//                 //isJsLike: true,
//                 extras: {
//                     wrapcss: true
//                 }
//             }, {
//                 reg: '**.inline.js',
//                 isMod: true,
//                 jswrapper : {
//                     type : 'js'//对inline.js中的文件不进行包裹
//                     //template : '${content}'
//                 },
//                 release : false
//             } //, {
//             //    reg: '**/qqapi.js',
//             //    isMod: false,
//             //    id: 'qqapi'
//             , {
//                 //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
//                 //直接引用为var $ = require('jquery');
//                 reg: /^\/modules\/((?:[^\/]+\/)*)([^\/]+)\/\2\.(js)$/i,
//                 //是组件化的，会被jswrapper包装
//                 isMod: true,
//                 //id为文件夹名
//                 id: '$1$2'
//             }, {
//                 //modules目录下的其他脚本文件
//                 reg: /^\/modules\/(.*)\.(js)$/i,
//                 //是组件化的，会被jswrapper包装
//                 isMod: true,
//                 //id是去掉modules和.js后缀中间的部分
//                 id: '$1'
//             }, {
//                 //modules目录下的其他脚本文件
//                 reg: /^\/modules\/(.*)\.(tpl)$/i,
//                 //是组件化的，会被jswrapper包装
//                 isMod: true,
//                 //id是去掉modules和.js后缀中间的部分
//                 id: '$1.tpl',
//                 release: '$0.js'
//             }, {
//                 //组件依赖组件的情况下，把组件里面的内容改掉，这里需要给出对应的组件匹配规则
//                 reg: /^\/lego_modules\/([^\/]+)\/(\d(?:\.\d)*){1}\/(\1|index)\.js$/i,
//                 isMod: true,
//                 //id为文件夹名
//                 id: '$1@$2',
//                 release: '$&'
//             }, {
//                 reg: /^\/lego_modules\/([^\/]+\/)(\d(?:\.\d)*){1}\/([^\/]+)\.js$/i,
//                 isMod: true,
//                 //id为文件夹名
//                 id: '$1$3@$2',
//                 release: '$&'
//             }, {
//                 reg: /^\/lego_modules\/(?:.*)\/([^\/]+)\.async\.(css|scss)$/i,
//                 isMod: true,
//                 id: '$1.async.$2',
//                 //isJsLike: true,
//                 extras: {
//                     wrapcss: true
//                 }
//             }, {
//                 reg: /^\/lego_modules\/(.*)(\.(js|tpl|html)|img\/(.)*)$/i,
//                 isMod: false,
//                 release: '$&'

//             }, {
//                 reg: /^\/lego_modules\/(.*)$/i,
//                 release: false

//             }
//         ]
//     }
// });

// fis.config.merge({
//     settings: {
//         prepackager: {
//             'ousiri-async-build': {
//                 lib: ['zepto', 'common', 'qqapi'],
//                 pkg: [
//                     'courseList',
//                     'myFav',
//                     'myPlan',
//                     'courseDetail', {
//                         id: 'courseDetail/courseDetail.async',
//                         excludes: ['courseDetail']
//                     },
//                     'courseDetail/courseDetail.async'
//                 ]
//             }
//         },
//         postprocessor: {
//             jswrapper: {
//                 type: 'amd'
//             }
//         },
//         postpackager: {
//             'ousiri-spm-build': {
//                 cssInline: true,
//                 useInlineMap: true,
//                 excludes: ['tvp']
//             },
//             'ousiri-add-content': [],
//             'ousiri-async-build': {
//                 libs: ['zepto', 'common', 'qqapi'],
//                 ignores: ['tvp'],
//                 cssInline: true,
//                 useInlineMap: true
//             }
//         },
//         deploy: {
//             'delete-unused-images': {
//                 dist: {
//                     from: '/',
//                     to: '../dist'
//                 }
//             }
//         }
//     }
// });

// fis.config.merge({
//     deploy: {
//         dev: {
//             to: '../dev'
//         },
//         dist: {
//             to: '../dist'
//         }
//     }
// });

// if (projConf.packSrc) {
//     for (var i = 0, len = projConf.packSrc.length; i < len; i++) {
//         projConf.packSrc[i].to = '../pack/' + projConf.packSrc[i].to;
//     }
//     fis.config.set('deploy.pack', projConf.packSrc || []);
// }