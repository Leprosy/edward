/**
 * edward.js - v0.5
 *
 * Welcome to edward, a simple presentation tool
 *
 *  Btw, Edward is the name of my cat daughter (@ed_minina on twitter)
 *  named after the Cowboy Bebop character... :)
 */

/* Namespace */
var Edward = {};

/* Attributes */
/**
 * Edward.transitions
 *
 * Container of the various transitions of edward.js slides. ini and end are
 * objects representing the initial and final state of css attributes of the
 * slide. outSlide and inSlide refers to the outgoing slide and the entering
 * slide in every transition.
 */
Edward.transitions = {
    fade: {
        outSlide: {
            ini: {
                opacity: 1
            },
            end: {
                opacity: 0
            }
        },
        inSlide: {
            ini: {
                opacity: 0
            },
            end: {
                opacity: 1
            }
        }
    },
    slide: {
        left: {
            outSlide: {
                ini: {
                    left: 0,
                    opacity: 1
                },
                end: {
                    left: 2000,
                    opacity: 0
                }
            },
            inSlide: {
                ini: {
                    left: -2000,
                    opacity: 0
                },
                end: {
                    left: 0,
                    opacity: 1
                }
            }
        },
        right: {
            outSlide: {
                ini: {
                    left: 0,
                    opacity: 1
                },
                end: {
                    left: -2000,
                    opacity: 0
                }
            },
            inSlide: {
                ini: {
                    left: 2000,
                    opacity: 0
                },
                end: {
                    left: 0,
                    opacity: 1
                }
            }
        }
    }
};


/* Methods */

/**
 * Initializing method.
 *
 * @param {string} id            selector for the container element.
 * @param {object} newconfig     object containing parameters.
 *
 * @return {boolean} false       if a problem occurs when initializing.
 */
Edward.init = function(id, newconfig) {
    /* Config */
    config = {
        timeBetween: 400,
        transition: 'fade'
    };
    $.extend(config, newconfig);

    Edward.timeBetween = config.timeBetween;
    Edward.transition = Edward.transitions[config.transition];

    if (typeof Edward.transition == 'undefined') {
        return Edward.error('invalid_transition_value');
    }

    /* Attributes */
    Edward.container = id;
    Edward.slides = $(id + ' article');
    Edward.currentSlideNum = 0;
    Edward.totalSlides = Edward.slides.length;

    /* Setup the slide show, hide and setup listener */
    $.each(Edward.slides, function(a, b) {
        $(b).attr('id', 'slide-' + a).addClass('slide')
            .css({'position': 'absolute', 'top': 0}).hide();
    });
    $(window).keydown(function(ev) {
        Edward.keyListener(ev);
    });

    /* Let's go to the presentation */
    if (window.location.hash) {
        Edward.currentSlideNum = window.location.hash.split('#slide-')[1];
    }

    Edward.show();
};

/**
 * Shows the selected slide.
 *
 * @param {int} slideNum    (optional)Number of the slide to show.
 *
 * @return {boolean} false       if a problem occurs when changing slides.
 */
Edward.show = function(slideNum) {
    /* Check valid requested slideNum */
    if (typeof slideNum === 'undefined') {
        slideNum = Edward.currentSlideNum;
    }

    /* Transition direction */
    var direction = 'right';

    if (slideNum < Edward.currentSlideNum) {
        direction = 'left';
    }

    /* Assign slide number */
    Edward.currentSlideNum = slideNum;

    if (slideNum > Edward.totalSlides - 1 || slideNum < 0 ||
            isNaN(slideNum)) {
        return Edward.error('invalid_slide_number');
    }

    /* Asign slides and do the animation */
    var previousSlide = $(Edward.container + ' .current');
    var nextSlide = $(Edward.slides[slideNum]);
    var outSlide, inSlide;

    /* Do transition */
    try {
        if (Edward.transition.hasOwnProperty(direction)) {
            outSlide = Edward.transition[direction].outSlide;
            inSlide = Edward.transition[direction].inSlide;
        } else {
            outSlide = Edward.transition.outSlide;
            inSlide = Edward.transition.inSlide;
        }

        /* Hook for onHide event*/
        if (previousSlide.attr('onHide')) {
            eval(previousSlide.attr('onHide'));
        }

        previousSlide.removeClass('current')
                     .css(outSlide.ini)
                     .animate(outSlide.end,
                              Edward.timeBetween);

        nextSlide.addClass('current')
                 .css(inSlide.ini)
                 .show()
                 .animate(inSlide.end, Edward.timeBetween, function() {
                     /* Hook for onShow event*/
                     if (nextSlide.attr('onShow')) {
                         eval(nextSlide.attr('onShow'));
                     }
                 });
    } catch (e) {
        return Edward.error('transition_def_error');
    }
};

/**
 * Show next slide
 *
 */
Edward.next = function() {
    if (Edward.currentSlideNum <= Edward.totalSlides - 2) {
        Edward.show(Edward.currentSlideNum + 1);
    }
};

/**
 * Show previous slide
 *
 */
Edward.prev = function() {
    if (Edward.currentSlideNum > 0) {
        Edward.show(Edward.currentSlideNum - 1);
    }
};

/**
 * Listener method for the key shortcuts
 *
 * @param {object} ev    Event object.
 */
Edward.keyListener = function(ev) {
    /* Get the key pressed and do the action */
    switch (ev.which) {
        case 37:
            Edward.prev();
            break;
        case 39:
            Edward.next();
            break;
        default:
            break;
    }
};

/**
 * Error management
 *
 * @param {string} msg   Error message for the debug console.
 *
 * @return {boolean} false       returns false for error management.
 */
Edward.error = function(msg) {
    console.error("Edward says : 'Prrrrrmeow..." + msg + "'");
    return false;
};

