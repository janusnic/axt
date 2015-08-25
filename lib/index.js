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
