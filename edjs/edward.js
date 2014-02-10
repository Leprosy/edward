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

    /* Initial setup */
    $(id).css({overflow: 'hidden', position: 'relative' });
    $(id).children().css({ position: 'absolute' }).hide();

    /* Clicking the slideshow make it the active one */
    var _this = this;

    $(id).on('click', function() {
        Edward.active = _this;
    });

    /* Activate this and show the first slide */
    Edward.active = this;
    this.show(1);
};

Edward.prototype.show = function(slideNum) {
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
    data.transition = data.newSlide.attr('data-transition') || 'simple';
    data.slideShow = this;
    data.callback = data.newSlide.attr('data-onshow') || false;

    /* Hook for the onHide event */
    if (data.prevSlide.attr('data-onhide')) {
        eval(data.prevSlide.attr('data-onhide'));
    };

    /* Do transition */
    data.transitions = (typeof this.transitions[data.transition] == 'function') ? data.transition : 'simple';
    this.transitions[data.transition](data);
    this.currentSlide = slideNum;
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
    Edward.active = this;
};



/* Transitions */
Edward.prototype.transitions = {};

Edward.prototype.transitions.simple = function(data) {
    data.prevSlide.hide();
    data.newSlide.show();

    if (data.callback) {
        eval(data.callback);
    }
};

Edward.prototype.transitions.crossfade = function(data) {
    data.prevSlide.fadeOut(data.time);
    data.newSlide.fadeIn(data.time);

    if (data.callback) {
        eval(data.callback);
    }
};

Edward.prototype.transitions.fade = function(data) {
    if (data.prevSlide.length) {
        data.prevSlide.fadeOut(data.time, function() {
            data.newSlide.fadeIn(data.time, function() {
                if (data.callback) {
                    eval(data.callback);
                }
            });
        });
    } else {
        data.newSlide.fadeIn(data.time, function() {
            if (data.callback) {
                eval(data.callback);
            }
        });
    }
};

Edward.prototype.transitions.slide = function(data) {
    var w = $(data.slideShow.container).width();

    data.prevSlide.animate({ left: (-data.direction * w) + 'px' }, data.time, function() {
        data.prevSlide.css({ left: 0 });
        data.prevSlide.hide();
    });

    data.newSlide.css({ left: (data.direction * w) + 'px', top: 0 });
    data.newSlide.show();
    data.newSlide.animate({ left: 0 }, data.time, function() {
        if (data.callback) {
            eval(data.callback);
        }
    });
};


/* Statics */
Edward.active = '';
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
window.onkeydown = function(ev) {
    if (Edward.active) {
        Edward.keyListener(ev);
    }
};

