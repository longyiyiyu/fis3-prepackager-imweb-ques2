var Factory = require('factory');

var test = Factory.extend({
    qElements: {
        t1: '#test-1',
        t2: '#test-2',
        t3: '#test-3',
        t4: '#test-4'
    },
    init: function() {
        console.log('main init!');
        this._init();
        this.t1.$set('text', 'just for test');
        this.t1.$.title.$set('text', 'just for test2');
        this.t2.$.title.$set('text', '你好！');
        this.t4.$set('text', '好了');
    }
});

module.exports = test;