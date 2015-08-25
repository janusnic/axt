var _$ = {
    Class: require('./src/Class.js').Class,
    Ajax: require('./src/Ajax.js').Ajax,
    EventEmitter: require('./src/EventEmitter.js').EventEmitter
};
if(module)
    if(module.exports)
        module.exports = exports = _$;
else
    window._$ = _$;


var Person = _$.EventEmitter.extend({});
var Chuck = Person.extend({
    init: function(){
        this.on('done', function(event,args){
           console.log('done event was fired! '+event+':'+args);
        });
        this.emit('done', 'testing', 'what');
    }
});
var chuck = new Chuck();
chuck.on('done', function(){
   return 0;
});