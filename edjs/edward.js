/* Namespace */
var Edward = {}

/**
 * Initializing method.
 * 
 * @param id    selector for the container element
 */
Edward.init = function(id) {
    /* Meta */
    Edward.container = id;
    Edward.slides = $(id + ' article');
    Edward.currentSlide = 0;
    Edward.totalSlides = Edward.slides.length;

    /* Hide and setup listener */
    $.each(Edward.slides, function(a,b) {
        $(b).attr('id', 'slide-' + a).hide();
    });
    $(Edward.slides[0]).addClass('current');
    $(window).keydown(function(ev) {
        Edward.keyListener(ev)
    });

    /* Let's go to the presentation */
    Edward.show();
}

/**
 * Shows the selected slide.
 * 
 * @param slideNum    (optional)Number of the slide to show.
 */
Edward.show = function(slideNum) {
    $(Edward.container + ' .current')
            .removeClass('current')
            .fadeOut(function() { 

        if (typeof slideNum === 'undefined') {
            slideNum = Edward.currentSlide;
        }
    
        $(Edward.slides[slideNum]).addClass('current').fadeIn();
    });
}

/**
 * Show next slide
 * 
 */
Edward.next = function() {
    if (Edward.currentSlide <= Edward.totalSlides - 2) { 
        Edward.currentSlide++;
        Edward.show();
    }
}

/**
 * Show previous slide
 * 
 */
Edward.prev = function() {
    if (Edward.currentSlide > 0) {
        Edward.currentSlide--;
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