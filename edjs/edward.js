/* Namespace */
var Edward = {}

/**
 * Initializing method.
 * 
 * @param id    selector for the container element
 */
Edward.init = function(id) {
    /* Attributes */
    Edward.container = id;
    Edward.slides = $(id + ' article');
    Edward.currentSlideNum = 0;
    Edward.totalSlides = Edward.slides.length;

    Edward.timeBetween = 400;
    Edward.transition = {
            outSlide: {
                opacity: 0
            }, 
            inSlide: {
                ini: {
                    opacity: 0
                },
                end: {
                    opacity: 1
                }
            }
        };

    /* Hide and setup listener */
    $.each(Edward.slides, function(a,b) {
        $(b).attr('id', 'slide-' + a).addClass('slide').hide();
    });
    $(window).keydown(function(ev) {
        Edward.keyListener(ev)
    });

    /* Let's go to the presentation */
    if (window.location.hash) {
        Edward.currentSlideNum = window.location.hash.split('#slide-')[1];
    }

    Edward.currentSlide = $(Edward.slides[Edward.currentSlideNum]).clone();
    Edward.show();
}

/**
 * Shows the selected slide.
 * 
 * @param slideNum    (optional)Number of the slide to show.
 */
Edward.show = function(slideNum) {
    if (typeof slideNum === 'undefined') {
        slideNum = Edward.currentSlideNum;
    }

    /* Switch slides using the specified function */
    Edward.currentSlide.animate(
        Edward.transition.outSlide, Edward.timeBetween, function() {
            Edward.currentSlide.remove();

            /* Show next slide */
            Edward.currentSlide = $(Edward.slides[slideNum])
                                          .clone()
                                          .addClass('current');
            $(Edward.container).prepend(Edward.currentSlide);
            Edward.currentSlide.show()
                               .css(Edward.transition.inSlide.ini)
                               .animate(
                                        Edward.transition.inSlide.end,
                                        Edward.timeBetween
                                );
        }
    );
}

/**
 * Show next slide
 * 
 */
Edward.next = function() {
    if (Edward.currentSlideNum <= Edward.totalSlides - 2) { 
        Edward.currentSlideNum++;
        Edward.show();
    }
}

/**
 * Show previous slide
 * 
 */
Edward.prev = function() {
    if (Edward.currentSlideNum > 0) {
        Edward.currentSlideNum--;
        Edward.show();
    }
}

/**
 * Listener method for the key shortcuts
 * 
 * @param ev    Event object
 */
Edward.keyListener = function(ev) {
    /* Get the key pressed and do the action */
    switch(ev.which) {
        case 37:
            Edward.prev();
            break;
        case 39:
            Edward.next();
            break;
        default:
            break;
    }
}