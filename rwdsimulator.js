/*
RWD Simulator 1.0.0 Marcus Pope Copyright 2012 MIT http://www.marcuspope.com/software

Open Source Initiative OSI - The MIT License (MIT):Licensing
[OSI Approved License]
The MIT License (MIT)
Copyright (c) 2011 InuYaksa
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Simulates any device width in the main browser. Will trigger css media queries based on dimension. Enables touch-drag
//operations via mouse for dimensions below 1200px. This was a rushed plugin, so a more configurable approach is welcomed.

//requires: nicescroll.js - https://github.com/inuyaksa/jquery.nicescroll
//          chrome requires a patch to nicescroll on line 263 - https://github.com/inuyaksa/jquery.nicescroll/issues/69
//          so for now just use the included copy
//usage: layout('tablet'), layout('tableth'), or layout(1024);
//       Add bookmarklets to the favorites bar to quickly switch between each resolution see bottom for more layout params

//TODO: Add UI overlay to screen for execution, instead of relying on console or javascript:urls
//TODO: Can we spoof the user agent across browsers?
	    //http://stackoverflow.com/questions/1307013/mocking-a-useragent-in-javascript
//TODO: Continue to add dimensions

$(function() {
	//reapply layout settings on page post / reload
	var reapply = localStorage.layoutArgs;

	if (reapply) {
		//no need to layout a desktop size onload
		if (reapply != 1200) {
			layout(reapply, window);
		}
	}
});

window.layout = function(xdim, winref) {
	//Allow for resizing the viewport to a specific dimension to better debug RWD css issues in browser

	//jquery bug requires explicit reference to window (in the case of popups for chrome)
	winref = winref || window;

	localStorage.layoutArgs = xdim;

	//Firstly let's check if we're running on chrome because we'll have to open a popup:
	//http://code.google.com/p/chromium/issues/detail?id=121184
	if (winref.name != "chromesux" && /chrome/i.test(navigator.userAgent)) {

		var x = winref.open(document.URL, "chromesux", "width=" + xdim + ",height=" + xdim);

		var delay = winref.setInterval(function() {
			//wait for jQuery to exist before laying out the window
			if (x.$) {
				clearInterval(delay);
				x.layout(xdim, x);
			}
		}, 300);

		return;
	}

	//Hide scrollbars because they muck with the viewport dimensions
	$("html").css("overflow", "hidden");

	function finishing_move(x) {
		//apply some finishing touches to the UI
		if (x < 1200) {
			$("html").niceScroll({
				touchbehavior : true,
				bouncescroll : true
			});
		}
		else {
			location.reload(); //disable nicescroll, and restore browser scrollbars
		}
	}

	//This is called multiple times to verify the viewport size
	function keep_it_rollin(x, y, repeat) {

		var scope = this;

		if (!repeat) {
			//seems jquery caches a reference to window and doesn't use what you pass into it
			//but incase they fix it, we'll call from and pass into the same object
			if (winref.$(winref).width() == x &&
				winref.$(winref).height() == y) {
				//already correct dimensions, but we need to load nicescroll again
				finishing_move(x);
				return;
			}

			//first resize will likely not be correct, unless the browser has a 0px chrome border
			winref.resizeTo(x, y);

			//need to check back in a couple millisecs for async processing
			if (winref.name == "chromesux") {
				winref.setTimeout(function() {
					keep_it_rollin(x, y, true);
				}, 500);
			}
			else {
				keep_it_rollin(x, y, true);
			}
		}
		else {
			//get the height difference (ie the dimensions of the chrome) <!-- confusing context much? :D
			var vx = winref.$(winref).width();
			var vy = winref.$(winref).height();

			//resize again to account for the difference
			winref.resizeTo(x + Math.abs(vx - x), y + Math.abs(vy - y));

			//finish him!
			finishing_move(x);
		}
	}

	//TODO: add other device dimensions for more complete UI testing
	//TODO: consider a config structure with override options
	if (xdim == 768 || xdim == "tablet") {
		keep_it_rollin(768, 1024);
	}
	if (xdim == 1024 || xdim == "tableth") {
		keep_it_rollin(1024, 768);
	}
	if (xdim == 1200 || xdim == "desktop") {
		keep_it_rollin(1200, 900);
	}
	if (xdim == 320 || xdim == "mobile") {
		keep_it_rollin(320, 480);
	}
	if (xdim == 480 || xdim == "mobileh") {
		keep_it_rollin(480, 320);
	}
};