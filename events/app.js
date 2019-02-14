const EventEmitter = require('events');

class CustomEventEmitter extends EventEmitter {
  constructor() {
    super();

    this.organization = 'Digital Avenues Ltd.';
    this.department = 'SDU';
    this.jobRoll = 'Software Engineer';
  }
}

const customEventEmitter = new CustomEventEmitter(),
  greetingEventEmitter = new CustomEventEmitter(),
  jdEventEmitter = new CustomEventEmitter(),
  onceCustomEventEmitter = new CustomEventEmitter(),
  errorEventEmitter = new CustomEventEmitter();

customEventEmitter.on('customEvent', () => {
  console.log(`Custom event handled at: ${new Date().getTime()}`);
});

greetingEventEmitter.on('greet', (firstName, lastName, sex = 'M') => {
  console.log(`
    Hello!
    ${('M' === sex) ? 'Mr.' : 'Mrs.'}${firstName + ' ' + lastName}!
    This is ${new Date().getTime()}
  `);
});

jdEventEmitter.on('getJobDescription', function (firstName, lastName, sex = 'M') {
  console.log(`
    Hello!
    ${('M' === sex) ? 'Mr.' : 'Mrs.'}${firstName + ' ' + lastName}!
    Following is your job description:
    Organization: ${this.organization}
    Department: ${this.department}
    Job Roll: ${this.jobRoll}
  `);
});

onceCustomEventEmitter.once('repititiveCustomEvent', () => {
  console.log('This would be prnted only once regardless how many times the repititiveCustomEvent is emitted.');
});

errorEventEmitter.on('error', (error) => {
  console.log(error.message);
});

customEventEmitter.emit('customEvent');
greetingEventEmitter.emit('greet', 'Saptarshi', 'Mandal');
jdEventEmitter.emit('getJobDescription', 'Purnika', 'Saha', 'F');
jdEventEmitter.emit('getJobDescription', 'Saptadeep', 'Bhowmik', 'M');
jdEventEmitter.emit('getJobDescription', 'Biresh', 'Das');
onceCustomEventEmitter.emit('repititiveCustomEvent');
onceCustomEventEmitter.emit('repititiveCustomEvent');
onceCustomEventEmitter.emit('repititiveCustomEvent');
onceCustomEventEmitter.emit('repititiveCustomEvent');
onceCustomEventEmitter.emit('repititiveCustomEvent');
errorEventEmitter.emit('error', new Error('This is a willful error'));
