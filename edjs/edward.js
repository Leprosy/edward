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
    this.steps = false;

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
    data.time = data.newSlide.attr('data-time') ? data.newSlide.attr('data-time') * 0.5 : 500;
    data.transition = data.newSlide.attr('data-transition');
    data.slideShow = this;

    /* Steps? */
    var steps = data.newSlide.find('[data-steps*="true"]');

    if (steps.length > 0) {
        steps.children().hide();
        this.steps = steps;
    }

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
    /* Is there any steps left? */
    if (this.steps) {
        this.steps.find(':hidden:first').fadeIn();

        if (this.steps.find(':hidden').length == 0) {
            this.steps = false;
        }
    } else {
        if (this.currentSlide < this.totalSlides) {
            this.show(this.currentSlide + 1);
        }
    }
};

Edward.prototype.previous = function() {
    if (this.steps) {
        this.steps = false;
    }

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
    data.prevSlide.fadeOut(data.time * 2);
    data.newSlide.fadeIn(data.time * 2, function() {
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
        data.newSlide.fadeIn(data.time * 2, function() {
            data.slideShow.endTransition();
        });
    }
};

Edward.transitions.rotate = function(data) {
    // Rotating function
    var time = data.prevSlide.length ? data.time : data.time * 2; 

    var fx = function(el, deg) {
        if (typeof(deg) === 'undefined') {
            deg = 1;
        }

        if (deg != 0 && deg < 180) {
            el.css('transform', 'rotate(' + deg + 'deg)');
            deg += 10;
            setTimeout(function() {
                fx(el, deg)
            }, time / 18);
        } else {
            el.css('transform', 'rotate(0deg)');
        }
    };

    if (data.prevSlide.length) {
        data.prevSlide.fadeOut(time);
        fx(data.prevSlide);
        setTimeout(function() {
            data.newSlide.fadeIn(time);
            fx(data.newSlide, -180);
        }, time);
    } else {
        data.newSlide.fadeIn(time);
        fx(data.newSlide, -180);
    }

    setTimeout(function() { data.slideShow.endTransition() }, time);
};

Edward.transitions.zoom = function(data) {
    // Zoom function
    var time = data.prevSlide.length ? data.time : data.time * 2; 

    var zoomin = function(el, size) {
        if (size < 4) {
            el.css('transform', 'scale(' + size + ')');
            size += 0.22;
            setTimeout(function() {
                zoomin(el, size)
            }, time / 18);
        } else {
            el.css('transform', 'scale(1)');
        }
    };

    var zoomin_zero = function(el, size) {
        if (size < 1) {
            el.css('transform', 'scale(' + size + ')');
            size += 0.06;
            setTimeout(function() {
                zoomin_zero(el, size)
            }, time / 18);
        } else {
            el.css('transform', 'scale(1)');
        }
    };

    if (data.prevSlide.length) {
        data.prevSlide.fadeOut(time);
        zoomin(data.prevSlide, 1);
        setTimeout(function() {
            data.newSlide.fadeIn(time);
            zoomin_zero(data.newSlide, 0);
        }, time);
    } else {
        data.newSlide.fadeIn(time);
        zoomin_zero(data.newSlide, 0);
    }

    setTimeout(function() { data.slideShow.endTransition() }, time);
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


crap = function(deg) {
    var el = $('article')[2];
    $(el).fadeOut();

    if (deg <= 180) {
        $(el).css('transform', 'rotate('+ deg + 'deg)');
        deg += 10;

        setTimeout(function() { crap(deg) }, 10);
    }
};
