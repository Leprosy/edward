/**
 * edward.js - v0.9
 *
 * Welcome to edward, a simple presentation tool
 *
 *  Btw, edward.js is the named after my cat daughter Edward (@ed_minina on twitter)
 *  who in turn was named after the Cowboy Bebop character... :)
 */

var Edward = function(id) {
    /* Check */
    if (!$(id).length) {
        return this.error('Container not found');
    }
    if ($(id).children().length == 0) {
        return this.error('No slides found');
    }

    /* Namespace attributes */
    this.container = id;
    this.currentSlide = 1;
    this.totalSlides = $(id).children().length;
    this.inTransit = false;

    /* Initial DOM setup */
    $(id).css({overflow: 'hidden', position: 'relative' });
    $(id).children().css({ position: 'absolute' }).hide();

    /* Clicking the slideshow make it the active one */
    var _this = this;
    $(id).unbind('click');
    $(id).on('click', function() { _this.setActive(); });

    /* Activate this slideshow and show the first slide */
    this.setActive();
    this.show(this.currentSlide);
};

Edward.prototype.show = function(slideNum) {
    /* In transit HQ? */
    if (this.inTransit) {
        return false;
    } else {
        this.inTransit = true;
    }

    /* Limits */
    if (slideNum < 1 || slideNum > this.totalSlides) {
        return this.error('Invalid slide number, ' + slideNum);
    }

    /* Prepare transition data */
    var data = {};
    data.direction  = this.currentSlide > slideNum ? -1 : 1;
    data.prevSlide = $(this.container).children(':visible');
    data.newSlide  = $($(this.container).children()[slideNum - 1]);
    data.time = data.newSlide.attr('data-time') ? data.newSlide.attr('data-time') * 1 : 800;
    data.transition = data.newSlide.attr('data-transition');
    data.slideShow = this;

    /* Hook for the onHide event */
    if (data.prevSlide.attr('data-onhide')) {
        eval(data.prevSlide.attr('data-onhide'));
    };

    /* Do transition */
    this.currentSlide = slideNum;
    data.transition = (typeof Edward.transitions[data.transition] == 'function') ? data.transition : 'simple';
    Edward.transitions[data.transition](data);
};

Edward.prototype.next = function() {
    if (this.currentSlide < this.totalSlides) {
        this.show(this.currentSlide + 1);
    }
};

Edward.prototype.previous = function() {
    if (this.currentSlide > 1) {
        this.show(this.currentSlide - 1);
    }
};

Edward.prototype.error = function(msg) {
    throw "edward.js error - " + msg;
    return false;
};

Edward.prototype.setActive = function() {
    /* Set active in the namespace */
    Edward.active = this;

    /* Feedback */
    var ct = this.container;
    $(ct).animate({ opacity: 0.9 }, 100, function() {
        $(ct).animate({ opacity: 1 }, 100);
    });

    /* Attach new listener */
    window.onkeydown = function(ev) {
        Edward.keyListener(ev);
    };
};

Edward.prototype.endTransition = function() {
    /* End transition */
    this.inTransit = false;

    /* Hook for the onshow event */
    var callback = $($(this.container).children()[this.currentSlide - 1]).attr('data-onshow');

    if (callback) {
        eval(callback);
    }
};


/* Statics */
/* Transitions */
Edward.transitions = {};

Edward.transitions.simple = function(data) {
    data.prevSlide.hide();
    data.newSlide.show();
    data.slideShow.endTransition();
};

Edward.transitions.crossfade = function(data) {
    data.prevSlide.fadeOut(data.time);
    data.newSlide.fadeIn(data.time, function() {
        data.slideShow.endTransition();
    });
};

Edward.transitions.fade = function(data) {
    if (data.prevSlide.length) {
        data.prevSlide.fadeOut(data.time, function() {
            data.newSlide.fadeIn(data.time, function() {
                data.slideShow.endTransition();
            });
        });
    } else {
        data.newSlide.fadeIn(data.time, function() {
            data.slideShow.endTransition();
        });
    }
};

Edward.transitions.slide = function(data) {
    var w = $(data.slideShow.container).width();

    data.prevSlide.animate({ left: (-data.direction * w) + 'px' }, data.time, function() {
        data.prevSlide.css({ left: 0 });
        data.prevSlide.hide();
    });

    data.newSlide.css({ left: (data.direction * w) + 'px' });
    data.newSlide.show();
    data.newSlide.animate({ left: 0 }, data.time, function() {
        data.slideShow.endTransition();
    });
};

Edward.active = false;

Edward.keyListener = function(ev) {
    /* Get the key pressed and do the action */
    switch (ev.which) {
        case 37:
            Edward.active.previous();
            break;
        case 39:
            Edward.active.next();
            break;
        default:
            break;
    }
};
