// Plugin code
(function ($) {
    /** Polyfills and prerequisites **/

    // requestAnimationFrame Polyfill
    const lastTime    = 0;
    const vendors     = ['webkit', 'o', 'ms', 'moz', ''];
    const vendorCount = vendors.length;

    for (let x = 0; x < vendorCount && ! window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }


    if ( ! window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            const currTime   = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));

            let id   = window.setTimeout(function() { callback(currTime + timeToCall, randomRGBA); }, timeToCall);
            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if ( ! window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    // Prefixed event check
    $.fn.prefixedEvent = function(type, callback) {
        for (let x = 0; x < vendorCount; ++x) {
            if ( ! vendors[x]) {
                type = type.toLowerCase();
            }

            el = (this instanceof jQuery ? this[0] : this);
            el.addEventListener(vendors[x] + type, callback, false);
        }

        return this;
    };

    // Test if element is in viewport
    const elementInViewport = (el) =>  {

        if (el instanceof jQuery) {
            el = el[0];
        }

        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
    }

    // Random array element
    const randomArrayElem = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Random integer
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /** Actual plugin code **/
    $.fn.sakura = function (event, options) {

        // Target element
        let target = this.selector == "" ? $('body') : this;

        // Defaults for the option object, which gets extended below
        let defaults = {
            blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
            className: 'sakura',
            fallSpeed: 1,
            maxSize: 14,
            minSize: 10,
            newOn: 300,
            swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
        };
        // tryed const and let not working var only works
        var options = $.extend({}, defaults, options);

        // Default or start event
        if (typeof event === 'undefined' || event === 'start') {

            // Set the overflow-x CSS property on the target element to prevent horizontal scrollbars
            target.css({ 'overflow-x': 'hidden' });

            // Function that inserts new petals into the document
            let petalCreator = function () {
              const red = Math.floor(Math.random() * 255);
              const green = Math.floor(Math.random() * 255);
              const blue = Math.floor(Math.random() * 255);
              const randomRGBA ='rgba('+red+','+green+','+blue+',1)';
                if (target.data('sakura-anim-id')) {
                    setTimeout(function () {
                        requestAnimationFrame(petalCreator);
                    }, options.newOn);
                }

                // Get one random animation of each type and randomize fall time of the petals
                const blowAnimation = randomArrayElem(options.blowAnimations);
                const swayAnimation = randomArrayElem(options.swayAnimations);
                const fallTime = ((document.documentElement.clientHeight * 0.007) + Math.round(Math.random() * 5)) * options.fallSpeed;

                // Build animation
                let animations =
                    'fall ' + fallTime + 's linear 0s 1' + ', ' +
                        blowAnimation + ' ' + (((fallTime > 30 ? fallTime : 30) - 20) + randomInt(0, 20)) + 's linear 0s infinite' + ', ' +
                        swayAnimation + ' ' + randomInt(2, 4) + 's linear 0s infinite';

                // Create petal and randomize size
                const petal  = $('<div class="' + options.className + '" />');
                const height = randomInt(options.minSize, options.maxSize);
                const width  = height - Math.floor(randomInt(0, options.minSize) / 3);

                // Apply Event Listener to remove petals that reach the bottom of the page
                petal.prefixedEvent('AnimationEnd', () => {
                    if ( ! elementInViewport(this)) {
                        $(this).remove();
                    }
                })
                // Apply Event Listener to remove petals that finish their horizontal float animation
                .prefixedEvent('AnimationIteration', function (ev) {
                    if (
                        (
                            $.inArray(ev.animationName, options.blowAnimations) != -1 ||
                            $.inArray(ev.animationName, options.swayAnimations) != -1
                        ) &&
                        ! elementInViewport(this)
                    ) {
                        $(this).remove();
                    }
                })
                .css({
                    '-webkit-animation': animations,
                    animation: animations,
                    'border-radius': randomInt(options.maxSize, (options.maxSize + Math.floor(Math.random() * 10))) + 'px ' + randomInt(1, Math.floor(width / 4)) + 'px',
                    height: height + 'px',
                    left: (Math.random() * document.documentElement.clientWidth - 100) + 'px',
                    'margin-top': (-(Math.floor(Math.random() * 20) + 15)) + 'px',
                    width: width + 'px',
                    background: randomRGBA
                });

                target.append(petal);
            };

            // Finally: Start adding petals
            target.data('sakura-anim-id', requestAnimationFrame(petalCreator));

        }
        // Stop event, which stops the animation loop and removes all current blossoms
        else if (event === 'stop') {

            // Cancel animation
            let animId = target.data('sakura-anim-id');

            if (animId) {
                cancelAnimationFrame(animId);
                target.data('sakura-anim-id', null);
            }

            // Remove all current blossoms
            setTimeout(function() {
                $('.' + options.className).remove();
            }, (options.newOn + 5000));

        }
    };

}(jQuery));

$(document).ready(function() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);
  const randomRGBA ='rgba('+red+','+green+','+blue+',1)';
  $('body').sakura("background",randomRGBA);
});
$(document).ready(function() {
    $('body').sakura();
});
