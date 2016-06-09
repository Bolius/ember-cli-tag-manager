/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-tag-manager',

  /*
   * Inject analytics scripts into
   * the page. These are conditional
   * upon values within the application
   * configuration.
   *
   * @method contentFor
   *
   * @params {String} type
   *   The type of content.
   *
   * @params {Object} appConfig
   *   Application configuration.
   *
   * @returns {String}
   *   Analytics scripts to append to the page.
   */
  contentFor: function(type, appConfig) {
    if (type === 'head-footer') {
      var tagManager = '';

      if (appConfig.APP.GOOGLE_TRACKING_ID) {
        tagManager += '<script type="text/javascript">\n' +
          '\t(function(i,s,o,g,r,a,m) {\n' +
          '\t\ti["GoogleAnalyticsObject"] = r; i[r] = i[r] || function() {\n' +
          '\t\t\t(i[r].q = i[r].q || []).push(arguments);\n' +
          '\t\t},\n' +
          '\t\ti[r].l = 1 * new Date(); a = s.createElement(o); a.src = g; a.async = 1;\n' +
          '\t\tm = s.getElementsByTagName(o)[0]; m.parentNode.insertBefore(a, m);\n' +
          '\t})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");\n' +
          '\tga("create", "' + appConfig.APP.GOOGLE_TRACKING_ID + '", "auto");\n';

        if (appConfig.APP.GOOGLE_REMARKETING) {
          tagManager += '\tga("require", "displayfeatures");\n';
        }

        if (appConfig.APP.GOOGLE_ECOMMERCE) {
          tagManager += '\tga("require", "ecommerce");\n';
        }

        if (appConfig.APP.GOOGLE_ENHANCED_ECOMMERCE) {
          tagManager += '\tga("require", "ec");\n';
        }

        tagManager += '</script>\n';
      }

      if (appConfig.APP.GOOGLE_TRACKING_UID) {
          tagManager += '<script>\n' +
                        'googleTrackingUid = "' + appConfig.APP.GOOGLE_TRACKING_UID + '";\n' +
                        '</script>\n';
      }

      if (typeof appConfig.APP.GOOGLE_TRACKING_EVENT_LABELS_AS_ACTION == 'object') {
          var lastLabelAsAction = '';
          tagManager += '<script>\n' +
                        'googleTrackingEventLabelsAsAction = [\n';
          for(var i=0; i < appConfig.APP.GOOGLE_TRACKING_EVENT_LABELS_AS_ACTION.length; i++) {
            tagManager += ( lastLabelAsAction != '' ? ',\n' : '') + '\t"'+ appConfig.APP.GOOGLE_TRACKING_EVENT_LABELS_AS_ACTION[i] + '"';
            lastLabelAsAction = appConfig.APP.GOOGLE_TRACKING_EVENT_LABELS_AS_ACTION[i];
          }
          tagManager += '\n];</script>\n';
      }

      if (appConfig.APP.GOOGLE_TRACKING_DIMENSIONS) {
          var lastDimension = '', currentDimension;
          tagManager += '<script>\n' +
                        'var googleTrackingDimensions = {';
          for(var key in appConfig.APP.GOOGLE_TRACKING_DIMENSIONS) {
            if (appConfig.APP.GOOGLE_TRACKING_DIMENSIONS.hasOwnProperty(key)) {
              currentDimension = key+':"' + appConfig.APP.GOOGLE_TRACKING_DIMENSIONS[key] + '"';
              tagManager += (lastDimension? ',' : '') + '\n\t' + currentDimension;
              lastDimension = currentDimension;
            }
          }
          tagManager += '\n};\n' +
                        '</script>\n';
      }

      tagManager += '<script>\n';
      if (appConfig.APP.GOOGLE_TRACKING_USE_H1_AS_TITLE) {
          tagManager += 'googleTrackingUseH1AsTitle = true;\n';
          if (appConfig.APP.GOOGLE_TRACKING_DEFAULT_H1) {
            tagManager += 'googleTrackingDefaultH1 = "' + appConfig.APP.GOOGLE_TRACKING_DEFAULT_H1 + '";\n';
          }
          else {
            tagManager += 'googleTrackingDefaultH1 = "";\n';
          }
      }
      else {
          tagManager += 'googleTrackingUseH1AsTitle = false;\n';
      }
      tagManager += '</script>\n';

      if (appConfig.APP.FACEBOOK_CUSTOM_AUDIENCES_TRACKING_ID) {
        tagManager += '<script type="text/javascript">\n' +
          '\t!function(f,b,e,v,n,t,s) {\n' +
          '\t\tif (f.fbq) return; n = f.fbq = function() {\n' +
          '\t\t\tn.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);\n' +
          '\t\t};\n' +
          '\t\tif (!f._fbq) f._fbq=n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue=[];\n' +
          '\t\tt = b.createElement(e); t.async = !0; t.src = v;\n' +
          '\t\ts = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);\n' +
          '\t}(window, document, "script", "//connect.facebook.net/en_US/fbevents.js");\n' +
          '\tfbq("init", "' + appConfig.APP.FACEBOOK_CUSTOM_AUDIENCES_TRACKING_ID + '");' +
          '</script>\n' +
          '<noscript>\n' +
          '\t<img height="1" width="1" alt="" style="display:none" src=' +
          '"https://www.facebook.com/tr?id=' + appConfig.APP.FACEBOOK_CUSTOM_AUDIENCES_TRACKING_ID +
          '&ev=PageView&noscript=1"/>\n' +
          '</noscript>\n';
      }

      if (appConfig.APP.FACEBOOK_CONVERSION_TRACKING_ID) {
        tagManager += '<script type="text/javascript">\n' +
          '\t(function() {\n' +
          '\t\tvar _fbq = window._fbq || (window._fbq = []);\n' +
          '\t\tif (!_fbq.loaded) {\n' +
          '\t\t\tvar fbds = document.createElement("script");\n' +
          '\t\t\tfbds.type = "text/javascript"; fbds.async = true;\n' +
          '\t\t\tfbds.src = "//connect.facebook.net/en_US/fbds.js";\n' +
          '\t\t\tvar s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(fbds, s);\n' +
          '\t\t\t_fbq.loaded = true;\n' +
          '\t\t}\n' +
          '\t})();\n' +
          '\twindow._fbq = window._fbq || [];\n' +
          '\twindow._fbq.push(["track", "' + appConfig.APP.FACEBOOK_CONVERSION_TRACKING_ID + '", {}]);\n' +
          '</script>\n' +
          '<noscript>\n' +
          '\t<img height="1" width="1" alt="" style="display:none" src=' +
          '"https://www.facebook.com/tr?ev=' + appConfig.APP.FACEBOOK_CONVERSION_TRACKING_ID + '&amp;noscript=1>\n' +
          '</noscript>\n';
      }

      return tagManager;
    }

    if (type === 'body-footer') {
      var tagManager = '';

      if (appConfig.APP.GOOGLE_ADWORDS_CONVERSION_TRACKING_ID) {
        tagManager += '<script type="text/javascript" src=' +
          '"//www.googleadservices.com/pagead/conversion_async.js"></script>\n';
      }

      if (appConfig.APP.BING_TRACKING_ID) {
        tagManager += '<script type="text/javascript">\n' +
          '\t(function(w,d,t,r,u) {\n' +
          '\t\tvar f, n, i;\n' +
          '\t\tw[u] = w[u] || [], f = function() {\n' +
          '\t\t\tvar o = { ti:"' + appConfig.APP.BING_TRACKING_ID + '" };\n' +
          '\t\t\to.q = w[u], w[u] = new UET(o);\n' +
          '\t\t},\n' +
          '\t\tn = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {\n' +
          '\t\t\tvar s = this.readyState;\n' +
          '\t\t\ts && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null);\n' +
          '\t\t}, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i);\n' +
          '\t})(window, document, "script", "//bat.bing.com/bat.js", "uetq");\n' +
          '</script>\n';
      }

      if (appConfig.APP.FACEBOOK_APP_ID) {
        tagManager += '<div id="fb-root"></div>\n' +
          '<script type="text/javascript">\n' +
          '\twindow.fbAsyncInit = function() {\n' +
          '\t\tFB.init({\n' +
          '\t\t\tappId: ' + appConfig.APP.FACEBOOK_APP_ID + ',\n' +
          '\t\t\txfbml: true,\n' +
          '\t\t\tversion: "v2.2"\n' +
          '\t\t});\n' +
          '\t};\n\n' +
          '\t(function(d, s, id) {\n' +
          '\t\tvar js, fjs = d.getElementsByTagName(s)[0];\n' +
          '\t\tif (d.getElementById(id)) return;\n' +
          '\t\tjs = d.createElement(s); js.id = id;\n' +
          '\t\tjs.src = "//connect.facebook.net/en_US/sdk.js";\n' +
          '\t\tfjs.parentNode.insertBefore(js, fjs);\n' +
          '\t}(document, "script", "facebook-jssdk"));\n' +
          '</script>\n';
      }

      if (appConfig.APP.INSPECTLET_TRACKING_ID) {
        tagManager += '<script type="text/javascript">\n' +
          '\twindow.__insp = window.__insp || [];\n' +
          '\t__insp.push(["wid", ' + appConfig.APP.INSPECTLET_TRACKING_ID + ']);\n' +
          '\t(function() {\n' +
          '\t\tfunction __ldinsp() {\n' +
          '\t\t\tvar insp = document.createElement("script");\n' +
          '\t\t\tinsp.type = "text/javascript"; insp.async = true; insp.id = "inspsync";\n' +
          '\t\t\tinsp.src = ("https:" == document.location.protocol ? ' +
          '"https://" : "http://") + "cdn.inspectlet.com/inspectlet.js";\n' +
          '\t\t\tvar x = document.getElementsByTagName("script")[0]; x.parentNode.insertBefore(insp, x);\n' +
          '\t\t}\n' +
          '\t\tif (window.attachEvent) window.attachEvent("onload", __ldinsp);\n' +
          '\t\telse window.addEventListener("load", __ldinsp, false);\n' +
          '\t})();\n' +
          '</script>\n';
      }

      if (appConfig.APP.OPTIMIZELY_TRACKING_ID) {
        tagManager += '<script type="text/javascript" src=' +
          '"//cdn.optimizely.com/js/' + appConfig.APP.OPTIMIZELY_TRACKING_ID + '.js"></script>\n';
      }

      return tagManager;
    }
  },
};
