/*
 * Example of a transition plugin
 * 
 * The data object is passed by the engine. It contains info for the transition
 * in its attributes:
 * 
 * data.newSlide - a jQuery collection representing the slide being shown
 * data.prevSlide - a jQuery collection representing the slide being hide(if any)
 * data.time - the time duration of the effect of each slide. The time between 2 slides is 2 * data.time
 * data.slideShow - the Edward object representing the global slideshow.
 * 
 * The logic can use jQuery and simple javascript methods to fiddle around with
 * the style and markup, but the last action MUST be data.slideShow.endTransition().
 * This marks the transition as over within the engine, and also calls the onshow
 * callback(if specified in the slide markup).
 * 
 * The plugin can be stored in any js file, but make sure edward.js library is already lodaded.
 */
Edward.transitions.insertcard = function(data) {
    var h = $(data.slideShow.container).height();
    var endTrans = function(data) {
        data.newSlide.css({ top: -h + 'px' });
        data.newSlide.show();
        data.newSlide.animate({ top: 0 }, data.time, function() {
            /* Last call MUST be this method */
            data.slideShow.endTransition();
        });
    }

    if (data.prevSlide.length > 0) {
        data.prevSlide.animate({ top: -h + 'px' }, data.time, function() {
            data.prevSlide.css({ top: 0 });
            data.prevSlide.hide();

            endTrans(data);
        });
    } else {
        endTrans(data);
    }
};