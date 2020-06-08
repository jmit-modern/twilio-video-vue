'use strict';

const { getUserFriendlyError } = require('./userfriendlyerror');

/**
 * Show the given error.
 * @param $modal - modal for showing the error.
 * @param error - Error to be shown.
 */
export function showError($modal, error) {
  // Add the appropriate error message to the alert.
  var alert_element = document.querySelector('div.alert', $modal);
  if(alert_element){
    alert_element.html(getUserFriendlyError(error))
  }
  $modal.modal({
    backdrop: 'static',
    focus: true,
    keyboard: false,
    show: true
  });
}
