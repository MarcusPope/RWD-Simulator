RWD-Simulator
=============

Simluates the viewport dimensions and touch drag interface of various mobile and tablet devices for responsive web development and testing.

* Simulates any device height/width in the desktop browser.
* Will trigger css media queries based on dimension.
* Enables touch-drag operations via mouse for dimensions below 1200px.
* Easier to use than Chrome's native approach, and cross browser in modern versions of IE/Safari/FF/Chrome.
* Keeps browser configured properly across page refreshes and browser sessions.

## Usage:

Just call the global function `layout` - `window.layout(1024)`, or `window.layout(768)` etc to trigger simluation mode.

Calling `layout(1200)` will disable the feature.

## Future enhancements:

* User Agent Spoofing? (If possible.)
* Configurable dimension maps.
* UI For changing dimensions instead of JavaScript Console / Bookmarklet interfaces

## Things To Note:

* To use this library either enter javascript:urls in the browser or developer toolbar console.  Or use bookmarklets.
* Window Resizing from JavaScript can only be achieved in top level browser tabs.  Which essentially means it can't have other tabs open in the window.
* You'll also want to avoid docking your developer toolbar, specially if you plan on using mobile device widths.
* Personally I think Chrome sucks sometimes, and wrt popups, this is one of those times.  Note to Chrome Developers: I'll change my variable name choice when you start adhering to specs even Microsoft implements!

<i>This was a rushed plugin, so a more configurable approach is welcomed.</i>