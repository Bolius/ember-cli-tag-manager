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
      if (typeof window.ga !== 'undefined') {
        var code = [].concat.apply(['send', 'event', 'button', 'click'], arguments);

        // Special case:
        // If code value is an ember model with a product identifer in "product" we use this instead of raw "code" object
        if (code.length > 0) {
          var value = code[code.length-1];
          if (typeof value === 'object' && value.get('product') != 'undefined') {
            code[code.length-1] = "" + value.get('product');
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
            window.ga('set', '&dt', gaTitle); // Set title
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
