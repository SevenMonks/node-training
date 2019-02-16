const EventEmitter = require('events');

console.log(`Default maximum listener count per event for the EventEmitter class: ${EventEmitter.defaultMaxListeners}`);

EventEmitter.defaultMaxListeners = 20;

console.log(`Default maximum listener count per event for the EventEmitter class; after change: ${EventEmitter.defaultMaxListeners}`);

class CustomEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

console.log(`Default maximum listener count per event for the CustomEventEmitter child class: ${CustomEventEmitter.defaultMaxListeners}`);

CustomEventEmitter.defaultMaxListeners = 10;

console.log(`
  Default maximum listener count after changing it via 'defaultMaxListeners' property of the 'CustomEventEmitter' class:
  1. The EventEmitter parent class: ${EventEmitter.defaultMaxListeners}
  2. The CustomEventEmitter child class: ${CustomEventEmitter.defaultMaxListeners}
`);

const customEventEmitter = new CustomEventEmitter(),
  anotherCustomEventEmitter = new CustomEventEmitter();

customEventEmitter.setMaxListeners(5);

console.log(`
  Maximum listener count for two instances of the CustomEventEmitter class
  1. customEventEmitter: ${customEventEmitter.getMaxListeners()}
  2. anotherCustomEventEmitter: ${anotherCustomEventEmitter.getMaxListeners()}
`);

const maxListenerCountForCustomEventEmitter = customEventEmitter.getMaxListeners();

for (let i = 0; i < 6; i++) {
  /**
   * Since customEventEmitter allows anly 5 listeners per event, hence without this check, the runtime will throw a memory leak error.
   */
  if (i < maxListenerCountForCustomEventEmitter) {
    customEventEmitter.addListener('customEvent', function customEventHandlerCallback() {
      console.log(`Event 'customEvent' handled in callback ${(i + 1)}`);
    });
  }
  
  anotherCustomEventEmitter.addListener('anotherCustomEvent', function anotherCustomEventHandlerCallback() {
    console.log(`Event 'anotherCustomEvent' handled in callback ${(i + 1)}`);
  });
}

// Emit events.
customEventEmitter.emit('customEvent');
anotherCustomEventEmitter.emit('anotherCustomEvent');

const customEventEmitter3 = new CustomEventEmitter();
