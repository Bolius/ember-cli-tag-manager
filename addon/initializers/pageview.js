import Ember from 'ember';

/*
 * Reopen the 'Router' object to extend the
 * didTrnasition functionality. This is where
 * we will intercept the normal behaviour and
 * push the page view to the Google Analytics
 * engine, Inspectlet and Optimizely.
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

  Ember.Router.reopen({

    /*
     * Push the page transition to the
     * Google Analytics engine.
     *
     * @method notifyGoogleAnalytics
     */
    notifyGoogleAnalytics: Ember.on('didTransition', function() {
      Ember.run.once(this, function() {
        if (logTracking) {
          Ember.Logger.info('Tracking Google Analytics pageview:', this.get('url'));
        }

        // Check if UID should be added
        if (googleTrackingUid !== 'undefined') {
          var f = new Function('return ' + googleTrackingUid + ';');
          var uid = f();
          if (typeof uid === 'string' && uid !== '') {
            window.ga('set', '&uid', uid);
          }
        }

        // Check if dimensions should be added
        if (typeof googleTrackingDimensions === 'object') {
          var dimensions = {};
          for (var key in googleTrackingDimensions) {
            var f = new Function('return ' + googleTrackingDimensions[key] + ';');
            var dimension = f();
            if (typeof dimension !== 'undefined') {
              dimensions[key] = dimension;
            }
          }
          window.ga('set', dimensions);
        }

        if (typeof window.ga !== 'undefined') {
          // We register a title for unknown pages without a H1 tag (shouldn't happen)
          var unknownPageTitle = 'Husets Kalender - ukendt side';

          // We also moved the pageview send to afterRender event in order to get hold of the H1 text
          Ember.run.scheduleOnce('afterRender', this, function() {
            var gaTitle = ("" + Ember.$('h1').first().html()).replace(/"/gi, '\\"');
            window.ga('send', 'pageview', { page: this.get('url'), title: ( gaTitle != '' ? gaTitle : unknownPageTitle ) });
          });

        }
      });
    }),


    /*
     * Push the page transition to the
     * Bing analytics engine.
     *
     * @method notifyBing
     */
    notifyBing: Ember.on('didTransition', function() {
      Ember.run.once(this, function() {
        if (logTracking) {
          Ember.Logger.info('Tracking Bing pageview:', this.get('url'));
        }

        if (typeof window.uetq !== 'undefined') {
          window.uetq.push('pageLoad');
        }
      });
    }),

    /*
     * Push the page transition to
     * Facebook.
     *
     * @method notifyFacebook
     */
    notifyFacebook: Ember.on('didTransition', function() {
      Ember.run.once(this, function() {
        if (typeof window.fbq !== 'undefined') {
          window.fbq('track', 'PageView');
        }
      });
    }),

    /*
     * Push the page transition to
     * Inspectlet.
     *
     * @method notifyInspectlet
     */
    notifyInspectlet: Ember.on('didTransition', function() {
      Ember.run.once(function() {
        if (typeof window.__insp !== 'undefined') {
          window.__insp.push(['virtualPage']);
        }
      });
    }),

    /*
     * Enable Optimizely experiments
     * for the route.
     *
     * @method notifyOptimizely
     */
    notifyOptimizely: Ember.on('didTransition', function() {
      Ember.run.once(function() {
        if (typeof window.optimizely !== 'undefined') {
          window.optimizely.push(['activate']);
        }
      });
    })
  });
}

export default {
  name: 'pageview',
  initialize: initialize
};
