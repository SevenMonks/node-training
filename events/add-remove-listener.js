const EventEmitter = require('events');

class CustomEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

const customEventEmitter = new CustomEventEmitter();

const customEvent1HandlerCallback1 = () => console.log(`First handler for the 'customEvent1' is called.`);
const customEvent1HandlerCallback2 = () => console.log(`Second handler for the 'customEvent1' is called.`);
const customEvent1HandlerCallback3 = () => console.log(`Third handler for the 'customEvent1' is called.`);

customEventEmitter.addListener('customEvent1', customEvent1HandlerCallback1);
customEventEmitter.on('customEvent1', customEvent1HandlerCallback2);
customEventEmitter.prependListener('customEvent1', customEvent1HandlerCallback3);

customEventEmitter.emit('customEvent1');

customEventEmitter.removeListener('customEvent1', customEvent1HandlerCallback2);

customEventEmitter.emit('customEvent1');

customEventEmitter.off('customEvent1', customEvent1HandlerCallback1);

customEventEmitter.emit('customEvent1');

const customEvent2HandlerCallback1 = () => console.log(`First handler for 'customEvent2' is called.`);
const customEvent2HandlerCallback2 = () => console.log(`Second handler for 'customEvent2' is called.`);
const customEvent2HandlerCallback3 = () => console.log(`Third handler for 'customEvent2' is called.`);

customEventEmitter.on('customEvent2', customEvent2HandlerCallback1);
customEventEmitter.once('customEvent2', customEvent2HandlerCallback2);
customEventEmitter.prependOnceListener('customEvent2', customEvent2HandlerCallback3);

for (let i = 0; i < 10; i++) {
  customEventEmitter.emit('customEvent2');
}
