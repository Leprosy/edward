edward.js
=========

Presentation tool written in Javascript. Uses jQuery for the javascript main codebase, and CSS for theming and styling.


Install and usage
-----------------

Get the source, edward.js, and include it in your html file. The source code of index.html is a good example to see how
the library is included and the slides content is implemented. You can see style.css for theming ideas.

Once your markup is ready, the library is initialized with the call

```javascript
Edward.init('#container')
```

where '#container' is a jQuery selector of your presentation container DOM element.


API
---

* Edward.init(*container*, *options*)

  Initializes the engine. *container* is a jQuery selector of the presentation container DOM object. *options* is a
hash of parameters for the presentations, currently these are supported:

  * timeBetween : Time between slides transitions, in miliseconds.
  * transition : The style of transition. Can be 'slide' or 'fade'.

  The options by default are timeBetween 500 and transition 'fade'.

* Edward.next()

  Advance to the next slide.

* Edward.prev()

  Shows the previous slide.

* Edward.show(*number*)

  Show the requested slide.