import app from './';
import mongoose from 'mongoose';

after(function() {
  return Promise.all([
    // Add any promises here for processes that need to be closed before the tests can finish
    
    new Promise(resolve => {
      mongoose.connection.close(resolve);
    }),
    new Promise(resolve => {
      app.angularFullstack.close(resolve);
    }),
    new Promise(resolve => {
      app.primus.end(resolve);
    }),
  ]);
});
