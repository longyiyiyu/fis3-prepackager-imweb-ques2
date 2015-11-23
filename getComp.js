module.exports = function(name, components) {
    for (var i = 0; i < components.length; i++) {
        var get = components[i];
        var comp;

        if (typeof get === 'string') {
            comp = readComp(get, name);
        } else if (typeof get === 'function') {
            comp = get(name);
        }

        if (comp) {
            return comp;
        }
    }
    return null;
};

function readComp(root, name) {
    var dir = [
        '', root.replace(/^\//, ''), name.replace(/-/g, '/'), ''
    ].join('/');
    var ret = {
        root: fis.project.getProjectPath(),
        name: name,
        dir: dir
    };

    // console.log('readComp', root, name, fis.project.getProjectPath(), dir, fis.util(fis.project.getProjectPath(), dir));
    if (fis.util.isDir(fis.util(fis.project.getProjectPath(), dir))) {
        if (fis.util.isFile(fis.util(fis.project.getProjectPath(), dir, 'main.html'))) {
            ret.html = dir + 'main.html';
        }

        if (fis.util.isFile(fis.util(fis.project.getProjectPath(), dir, 'main.js'))) {
            ret.js = dir + 'main.js';
        }

        if (fis.util.isFile(fis.util(fis.project.getProjectPath(), dir, 'main.css'))) {
            ret.css = dir + 'main.css';
        }

        if (fis.util.isFile(fis.util(fis.project.getProjectPath(), dir, 'main.scss'))) {
            ret.scss = dir + 'main.scss';
        }

        if (fis.util.isFile(fis.util(fis.project.getProjectPath(), dir, 'main.less'))) {
            ret.less = dir + 'main.less';
        }

        return ret;
    } else {
        return null;
    }
}
