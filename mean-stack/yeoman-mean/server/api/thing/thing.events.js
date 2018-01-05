/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
var ThingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Thing) {
  for(var e in events) {
    let event = events[e];
    Thing.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ThingEvents.emit(`${event}:${doc._id}`, doc);
    ThingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ThingEvents;
