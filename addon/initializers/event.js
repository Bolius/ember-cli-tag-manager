import Ember from 'ember';

/*
 * Reopen the 'ActionHandler' object to extend
 * the send functionality. This is where we
 * will intercept the normal behaviour and push
 * the action to the Google Analytics engine.
 *
 * @method initialize
 *
 * @param {Ember.Container} container
 *   The application instance's container. The container stores all of the instance-specific state for this application.
 *
 * @param {Ember.Application} application
 *   The starting point for every Ember application.
 */
export function initialize(container, application) {
  var logTracking = application.get('LOG_TRACKING');

  return Ember.ActionHandler.reopen({

    /*
     * Push the event to the Google
     * Analytics engine.
     *
     * @method send
     */
    send: function() {
        this._super.apply(this, arguments);

        if (logTracking) {
          Ember.Logger.info('Tracking Google Analytics event:', JSON.stringify([].slice.call(arguments)));
        }

        // Create a generic array of arguments to
        // send Google Analytics. Most actions
        // will be a result of clicking a button.
        var arr = ['send', 'event', 'button', 'click'];

        if (typeof window.ga !== 'undefined') {
          // Check for labels in googleTrackingEventLabelsAsAction array
          // to see if we want the label registered as action instead of 'click'
          if (typeof googleTrackingEventLabelsAsAction === 'object') {
            for(var i = 0; i < googleTrackingEventLabelsAsAction.length; i++) {
              // We only check for objects with contents {"0": [label], "1": [value]}
              if (arguments[0]) {
                // Check if label in array of labels to remove action for
                if (googleTrackingEventLabelsAsAction[i] === arguments[0] || googleTrackingEventLabelsAsAction[i] === '*') {
                  arr.pop(); // Remove 'click' from array - note that * functions as an "all" parameter
                }
              }
            }
          }

          var code = [].concat.apply(arr, arguments);

          // Special case:
          // If code value is an ember model with a product identifer in "product" we use this instead of raw "code" object
          if (code.length > 0) {
            var value = code[code.length-1];

            if (typeof value === 'object' && value.get('product') != 'undefined' && value.get('product') != null) {
              code[code.length-1] = "" + value.get('product'); // Use articleid
            }
            else if (typeof value === 'object' && value.get('title') != 'undefined' && value.get('title') != null) {
              code[code.length-1] = "Task:" + (""+value.get('title').replace(/"/gi, '\\"')); // Use task title
            }
            else {
              code[code.length-1] = "" + code[code.length-1];
            }

            // We move the event send to afterRender event in order to get hold of the H1 text
            Ember.run.scheduleOnce('afterRender', this, function() {
              var gaTitle = '';
              if (googleTrackingUseH1AsTitle) {
                // We should use H1 as title
                var gaH1 = ("" + Ember.$('h1').first().html()).replace(/"/gi, '\\"');
                if (gaH1 === '' || gaH1 === 'undefined') {
                  gaH1 = googleTrackingDefaultH1; // H1 is not set so we use default H1 from config
                }
                gaTitle = gaH1 !== '' ? gaH1 : googleTrackingDefaultH1;
              }
              else {
                // We just use the current page title
                gaTitle = this.get('title');
              }
              window.ga('set', 'title', gaTitle); // Set title
              window.ga.apply(this, code);
            });
          }
        }
    }
  });
}

export default {
  name: 'event',
  initialize: initialize
};
