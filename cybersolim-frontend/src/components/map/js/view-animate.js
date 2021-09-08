/**
 * 一些地图动画
 * @see http://openlayers.org/en/latest/examples/animation.html
 */


/**
 * @param {ol.View} view map view
 * @param {ol.Coordinate} location
 * @param {Function} done callback
 */
function flyTo(view, location, done) {
    var duration = 4000;
    var zoom = view.getZoom();
    var parts = 3;
    var called = false;

    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
        center: location,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoom - 1,
        duration: duration / 2
    }, {
        zoom: zoom,
        duration: duration / 2
    }, callback);
}

/**
 * 依次经过多个地点之后，再将地图中心变换为最后一坐标点
 * @param {Array} locations, e.g.:
 * var london = ol.proj.fromLonLat([-0.12755, 51.507222]);
 * [london, bern, rome, moscow, istanbul];
 * @param {Function} done callback
 * @param {Function} cancelled callback
 */
function tour(locations, done, cancelled) {
    var index = -1;

    function next(more) {
        if (more) {
            ++index;
            if (index < locations.length) {
                var delay = index === 0 ? 0 : 750;
                setTimeout(function() {
                    flyTo(locations[index], next);
                }, delay);
            } else {
                done;
            }
        } else {
            cancelled;
        }
    }
    next(true);
}

// A bounce easing method (from https://github.com/DmitryBaranovskiy/raphael).
function bounce(t) {
    var s = 7.5625,
        p = 2.75,
        l;
    if (t < (1 / p)) {
        l = s * t * t;
    } else {
        if (t < (2 / p)) {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
        } else {
            if (t < (2.5 / p)) {
                t -= (2.25 / p);
                l = s * t * t + 0.9375;
            } else {
                t -= (2.625 / p);
                l = s * t * t + 0.984375;
            }
        }
    }
    return l;
}
// An elastic easing method (from https://github.com/DmitryBaranovskiy/raphael).
function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

/**
 * 以动画的形式变换地图中心
 * @param {ol.View} view
 * @param {ol.Coordinate} position
 * @param {Number} duration
 */
function animateCenter(view, position, duration) {
    view.animate({
        center: position,
        duration: duration
    });
}

export const ViewAnimate = {
    flyTo,
    elastic,
    bounce,
    tour,
    animateCenter
}
