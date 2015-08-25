var _$ = {
    class: require('./src/Class.js').class,
    ajax: require('./src/Ajax.js').ajax,
    eventEmitter: require('./src/EventEmitter.js').eventEmitter
};
if(module)
    if(module.exports)
        module.exports = exports = _$;
else
    window._$ = _$;


var Person = _$.eventEmitter.extend({});
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