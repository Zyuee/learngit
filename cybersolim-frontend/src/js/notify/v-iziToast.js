/**
 * iziToast notifications
 */
import iziToast from "izitoast";
const defaultPosition = 'topCenter';
const defaultDuration = 5000;
// bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
// setting default options
iziToast.settings({
  resetOnHover: true,
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX'
});

// Destroy all toasts.
function destroy()
{
  iziToast.destroy();
}

/**
 *
 * @param {String} msg
 * @param {Number} time
 * @param {String} pos
 */
function info( msg, time = defaultDuration, pos = defaultPosition )
{
  iziToast.info({
    title: 'Info',
    message: msg,
    position: pos,
    timeout: time
  });
}
/**
 * iziToast.show
 * @param {Object} config  iziToast configuration
 */
function show( config ) {
  iziToast.show(config);
}

function holdOn(msg, customId = Date.now().toString(), pos = defaultPosition) {
  iziToast.show({
    id: customId,
    title: 'Info',
    message: msg,
    position: pos,
    theme:'dark',
    drag:false,
    close:false,
    progressBarColor: 'rgb(0, 255, 184)',
    timeout: false,
    image:'../static/img/loading-blue.gif',
  });
}
function hide(toast) {
  iziToast.hide({}, toast);
}
function success( msg, time = defaultDuration, pos = defaultPosition )
{
  iziToast.success({
    title: 'OK',
    message: msg,
    position: pos,
    timeout: time
  });
}

function warning( msg, time = defaultDuration, pos = defaultPosition )
{
  iziToast.warning({
    title: 'Caution',
    message: msg,
    position: pos,
    timeout: time
  });
}

function error( msg, time = defaultDuration, pos = defaultPosition )
{
  iziToast.error({
    title: 'Error',
    message: msg,
    position: pos,
    timeout: time
  });
}

export const vIziToast = {
  destroy, error, success, warning, info, show,holdOn,hide
}
