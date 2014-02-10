edward.js
=========

Presentation tool written in Javascript. Uses jQuery for the javascript main codebase, and CSS for theming and styling.


Install and usage
-----------------

Get the source, edward.js, and include it in your html file. The source code of index.html is a good example to see how
the library is included and the slides content is implemented. You can see style.css for theming ideas. The basics are,
you must have a container element, and inside that, one or more child elements, usually block tags(ie: articles, divs), with the content of the slides of your presentation.

You can style the presentation with css, but keep in mind that the dimensions of the slides are contrained by the container element. Again, see the demo HTML for reference.

Once your markup is ready, the presentation is initialized with the call

```javascript
var slideshow = new Edward('#container')
```

where '#container' is a jQuery selector of your presentation container DOM element.

With the current version of the library, you can manage more than one presentation. Clicking a presentation makes it the current "active" one, and the keyboard events will affect that slideshow.

API
---

An Edward object has the following methods:

* .show(n) 

  Shows the n-th slide, if that slide exists.

* .next()

  Advance to the next slide.

* .previous()

  Shows the previous slide.

