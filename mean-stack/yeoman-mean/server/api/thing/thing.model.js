'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './thing.events';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ThingSchema);
export default mongoose.model('Thing', ThingSchema);
