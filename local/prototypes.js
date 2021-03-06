//'use strict';
/*
////////////////////////////////////////////////////////////////////////////////////
// onbeforeprint / onafterprint compatibility stub
////////////////////////////////////////////////////////////////////////////////////
var beforePrint = function() {
  console.log('Functionality to run before printing.');
};
var afterPrint = function() {
  console.log('Functionality to run after printing');
};
if (window.matchMedia) {
  var mediaQueryList = window.matchMedia('print');
  mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
      beforePrint();
    } else {
      afterPrint();
    }
  });
}
window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
////////////////////////////////////////////////////////////////////////////////////
*/

/*
////////////////////////////////////////////////////////////////////////////////////
// appcache debug
////////////////////////////////////////////////////////////////////////////////////
var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

var cache = window.applicationCache;

function logEvent (e) {
  var online, status, type, message;
  online = (navigator.onLine) ? 'yes' : 'no';
  status = cacheStatusValues[cache.status];
  type = e.type;
  message = 'online: ' + online;
  message += ', event: ' + type;
  message += ', status: ' + status;
  if (type === 'error' && navigator.onLine) {
    message += ' (probably a syntax error in manifest)';
  }
  console.log(message);
}

cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

window.applicationCache.addEventListener(
  'updateready', 
  function () {
    console.info('An update is ready');
    if (confirm("An update is ready. Press OK to use it now.")) {
      location.reload();
      //window.applicationCache.swapCache();
      //console.log('swap cache has been called');
    }
  }, 
  false
);

setInterval(function () { cache.update(); }, 5000);
////////////////////////////////////////////////////////////////////////////////////
*/

/*
// hide address bar on mobile (TODO: must be further investigated...)
function hideAddressBar() {
  if (document.documentElement.scrollHeight < ((window.outerHeight + 60) / window.devicePixelRatio)) {
    document.documentElement.style.height = ((window.outerHeight + 60) / window.devicePixelRatio) + 'px';
  }
  setTimeout(window.scrollTo(1, 1), 0);
}
window.addEventListener('load', function() { hideAddressBar(); });
window.addEventListener('orientationchange', function() { hideAddressBar(); });
*/