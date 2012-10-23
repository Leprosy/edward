/**
 *  Welcome to edward, a simple presentation tool
 *  
 *  Btw, Edward is the name of my cat daughter (@ed_minina on twitter)
 *  named after the Cowboy Bebop character... :)
 */

/* Namespace */
var Edward = {}

/* Attributes */
Edward.transitions = {
    fade: {
        outSlide: {
            opacity: 0
        }, 
        inSlide: {
            opacity: 1
        }
    },
    scale: {
        outSlide: {
            //opacity: 0,
            height: 0
        },
        inSlide: {
            //opacity: 1,
            height: '100%'
        }
    }
};


/* Methods */

/**
 * Initializing method.
 * 
 * @param id    selector for the container element
 */
Edward.init = function(id, newconfig) {
    /* Config */
    config = {
        timeBetween: 400,
        transition: 'fade'
    }
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
    /* Check valid requested slideNum */
    if (typeof slideNum === 'undefined') {
        slideNum = Edward.currentSlideNum;
    }

    if (slideNum > Edward.totalSlides - 1 || slideNum < 0 ||
            isNaN(slideNum)) {
        return Edward.error('invalid_slide_number');
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
                               .css(Edward.transition.outSlide)
                               .animate(
                                        Edward.transition.inSlide,
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

/**
 * Error management
 *
 * @param msg   Error message for the debug console
 */
Edward.error = function(msg) {
    console.error("Edward says : 'Prrrrrmeow..." + msg + "'");
    return false;
}

