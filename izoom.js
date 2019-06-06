/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */

// solution is handling both
// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
// http://stackoverflow.com/questions/14439903/how-can-i-detect-device-touch-support-in-javascript
// https://bugs.chromium.org/p/chromium/issues/detail?id=467934
// This happens with chrome://flags/#touch-events on "Automatic" on a Lenovo Thinkpad W540 laptop, no touchscreen, but having the builtin trackpad.

var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);

hasTouch = 'ontouchstart' in window && !isTouchPad;

(function(window, doc){
var m = Math,
    dummyStyle = doc.createElement('div').style,
    vendor = (function () {
        var vendors = 't,webkitT,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = vendors.length;

        for ( ; i < l; i++ ) {
            t = vendors[i] + 'ransform';
            if ( t in dummyStyle ) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })(),
    cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

    // Style properties
    transform = prefixStyle('transform'),
    transitionProperty = prefixStyle('transitionProperty'),
    transitionDuration = prefixStyle('transitionDuration'),
    transformOrigin = prefixStyle('transformOrigin'),
    transitionTimingFunction = prefixStyle('transitionTimingFunction'),
    transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
    TRNEND_EV = (function () {
        if ( vendor === false ) return false;

        var transitionEnd = {
                ''            : 'transitionend',
                'webkit'    : 'webkitTransitionEnd',
                'Moz'        : 'transitionend',
                'O'            : 'otransitionend',
                'ms'        : 'MSTransitionEnd'
            };

        return transitionEnd[vendor];
    })(),

    nextFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) { return setTimeout(callback, 1); };
    })(),
    cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })(),

    // Helpers
    translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
    /*iScroll*/iMyZoom = function (el, options) {
        var that = this,
            i;

        that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
        that.wrapper.style.overflow = 'hidden';
        that.scroller = that.wrapper.children[0];
        
        // Default options
        that.options = {
            hScroll: true,
            vScroll: true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: true,
            useTransition: false,
            topOffset: 0,
            checkDOMChanges: false,        // Experimental
            handleClick: true,//false,

            // Scrollbar
            hScrollbar: true,
            vScrollbar: true,
            fixedScrollbar: isAndroid,
            hideScrollbar: isIDevice,
            fadeScrollbar: isIDevice && has3d,
            scrollbarClass: '',

            // Zoom
            zoom: false,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: 'scroll',

            // Snap
            snap: false,
            snapThreshold: 1,

            // Events
            onRefresh: null,
            onBeforeScrollStart: function (e) { e.preventDefault(); },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,//function () { InitLoadPagesOnFirstZoom(); },
            onZoom: null,
            onZoomEnd: null,
            
            onSwipeLeft: null,
            onSwipeRight: null,
            pageWidth: 600,
            pageHeight: 800
        };

        // User defined options
        for (i in options) that.options[i] = options[i];

        
        // Normalize options
        that.options.useTransform = hasTransform && that.options.useTransform;
        that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
        that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
        that.options.zoom = that.options.useTransform && that.options.zoom;
        that.options.useTransition = hasTransitionEnd && that.options.useTransition;

        // Helpers FIX ANDROID BUG!
        // translate3d and scale doesn't work together!
        // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
        if ( that.options.zoom && isAndroid ){
            translateZ = '';
        }
        
        // Set some default styles
        that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
        that.scroller.style[transitionDuration] = '0';
        that.scroller.style[transformOrigin] = '0 0';
        if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
        
        /*that.setStartingPosition();*/
        
        if (that.options.useTransition) that.options.fixedScrollbar = true;

        /*that.refresh(false);*/

        // SLA
        /*
        if (that.scrollerW < that.wrapperW) {
            // if width to be displayed smaller than display width then center it
            that.x = (that.wrapperW - that.scrollerW) / 2;
            that.x = m.round(that.x);
            //console.log('adjust=' + that.x);
        }
        
        if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
        else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';
        */
        // SLA

        $(that).bind('dblclick', function(e) {                // dblclick via une note
            alert("dblclick0");
            //console.log('izoom dlbclick event');
            //console.log(e);
            that.zoom(e.clientX, e.clientY, null, 0, true);
            e.preventDefault();
            e.stopPropagation();
        });

        that._bind('dblclick');                // dblclick sur l'image
        that._bind('click');                // click sur l'image


        that._bind(RESIZE_EV, window);
        that._bind(/*START_EV*/'touchstart'); that._bind('mousedown');
        //if (!hasTouch) {
            if (that.options.wheelAction != 'none') {
                that._bind('DOMMouseScroll');
                that._bind('mousewheel');
            }
        //}

        if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
            that._checkDOMChanges();
        }, 500);
    };

// Prototype
/*iScroll*/iMyZoom.prototype = {
    enabled: true,
    x: 0,
    y: 0,
    steps: [],
    scale: 1,
    currPageX: 0, currPageY: 0,
    pagesX: [], pagesY: [],
    aniTime: null,
    wheelZoomCount: 0,
    nBind: 0,
    deferResizeID: null,

    
    handleEvent: function (e) {
        var d = new Date();
        var n = d.toString();
        var that = this;
        switch(e.type) {
            case /*START_EV*/'touchstart':
            case 'mousedown':
                if (/*!hasTouch*/ e.type == 'mousedown' && e.button !== 0) return;        // souris + button alors return
                that._start(e);
                break;
            case /*MOVE_EV*/'touchmove':
            case 'mousemove':
                that._move(e);
                break;
            case /*END_EV*/'touchend':
            case 'mouseup':
            case /*CANCEL_EV*/'touchcancel':
            case 'mouseup':
                that._end(e);
                break;
            case RESIZE_EV:
                that._resize(); break;
            case 'DOMMouseScroll':
            case 'mousewheel':
                that._wheel(e);
                break;
            case TRNEND_EV: that._transitionEnd(e); break;
            case 'dblclick':
                //console.log("handleEvent dblclick");
                //console.log(e.clientX);
                //console.log(e.clientY);
                //console.log(e);
                //alert("iZoom handleEvent dblclick1");
                onFirstZoomLoadHD(e);        // InitLoadPagesOnFirstZoom();
                that.zoom(e.clientX, e.clientY, null, 0, true);
                e.preventDefault();
                e.stopPropagation();
                break;
            case 'click':
                //alert("iZoom handleEvent click1");
                // à mettre sous forme de onClick()
                closeTopBar();
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    },
    
    _checkDOMChanges: function () {
        if (this.moved || this.zoomed || this.animating ||
            (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

        this.setStartingPosition();
        this.refresh(false);
    },
    
    _scrollbar: function (dir) {
        var that = this,
            bar;

        if (!that[dir + 'Scrollbar']) {
            if (that[dir + 'ScrollbarWrapper']) {
                if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                that[dir + 'ScrollbarWrapper'] = null;
                that[dir + 'ScrollbarIndicator'] = null;
            }

            return;
        }

        if (!that[dir + 'ScrollbarWrapper']) {
            // Create the scrollbar wrapper
            bar = doc.createElement('div');

            if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
            else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

            that.wrapper.appendChild(bar);
            that[dir + 'ScrollbarWrapper'] = bar;

            // Create the scrollbar indicator
            bar = doc.createElement('div');
            if (!that.options.scrollbarClass) {
                bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
            }
            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
            if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

            that[dir + 'ScrollbarWrapper'].appendChild(bar);
            that[dir + 'ScrollbarIndicator'] = bar;
        }

        if (dir == 'h') {
            that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
            that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
            that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
            that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
            that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
        } else {
            that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
            that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
            that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
            that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
            that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
        }

        // Reset position
        that._scrollbarPos(dir, true);
    },
    
    /*_resize: function () {
        console.log('_resize');
        var that = this;
        setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
    },*/
    
    _pos: function (x, y) {
        if (this.zoomed) return;

        // SLA
        /*x = this.hScroll ? x : 0;        .hScroll tient compte de .option.hScroll mais pas que de �a
        y = this.vScroll ? y : 0;*/
        // SLA

        if (this.options.useTransform) {
            this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
        } else {
            x = m.round(x);
            y = m.round(y);
            this.scroller.style.left = x + 'px';
            this.scroller.style.top = y + 'px';
        }

        this.x = x;
        this.y = y;
        //console.log('_pos' + 'x=' + x + 'y=' + y);

        this._scrollbarPos('h');
        this._scrollbarPos('v');
    },

    _scrollbarPos: function (dir, hidden) {
        var that = this,
            pos = dir == 'h' ? that.x : that.y,
            size;

        if (!that[dir + 'Scrollbar']) return;

        pos = that[dir + 'ScrollbarProp'] * pos;

        if (pos < 0) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
            }
            pos = 0;
        } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
            } else {
                pos = that[dir + 'ScrollbarMaxScroll'];
            }
        }

        that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
        that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
        that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
    },
    
    _start: function (e) {
        /*touchstart mousedown*/
        var that = this,
            point = /*hasTouch*/ e.type == 'touchstart' ? e.touches[0] : e,
            matrix, x, y,
            c1, c2;

        if (!that.enabled) return;

if (that.nBind == 0) {
        that.nBind = 1;
        that._bind(/*MOVE_EV*/'touchmove', window); that._bind('mousemove', window);
        that._bind(/*END_EV*/'touchend', window); that._bind('mouseup', window);
        that._bind(/*CANCEL_EV*/'touchcancel', window); that._bind('mouseup', window);
} else {
        that.nBind = that.nBind + 1;
}

        if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

        if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

        that.moved = false;
        that.animating = false;
        that.zoomed = false;
        that.distX = 0;
        that.distY = 0;
        that.absDistX = 0;
        that.absDistY = 0;
        that.dirX = 0;
        that.dirY = 0;

        // Gesture start
        if (that.options.zoom && /*hasTouch*/ e.type == 'touchstart' && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
            that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

            that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
            that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

            if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
        }

        if (0) { // that.options.momentum) {
            if (that.options.useTransform) {
                // Very lame general purpose alternative to CSSMatrix
                matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
            }
            
            if (x != that.x || y != that.y) {
                if (that.options.useTransition) that._unbind(TRNEND_EV);
                else cancelFrame(that.aniTime);
                that.steps = [];
        //console.log('_posB');
                that._pos(x, y);
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
            }
        }

        that.absStartX = that.x;    // Needed by snap threshold
        that.absStartY = that.y;

        that.startX = that.x;
        that.startY = that.y;
        that.pointX = point.pageX;
        that.pointY = point.pageY;

        that.startTime = e.timeStamp || Date.now();
        // SLA
        that.swipeStartTime = e.timeStamp || Date.now();
        that.startPointX = point.pageX;
        that.startPointY = point.pageY;
        // SLA

        if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

    },
    
    _move: function (e) {
        /* touchmove mousemove */
        var that = this,
            point = /*hasTouch*/ e.type == 'touchmove' ? e.touches[0] : e,
            deltaX = point.pageX - that.pointX,
            deltaY = point.pageY - that.pointY,
            newX = that.x + deltaX,
            newY = that.y + deltaY,
            c1, c2, scale,
            timestamp = e.timeStamp || Date.now();

        if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

        // Zoom
        if (that.options.zoom && /*hasTouch*/ e.type == 'touchmove' && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
            that.touchesDist = m.sqrt(c1*c1+c2*c2);

            that.zoomed = true;

            scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

            if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
            else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

            scale = Math.max(that.options.zoomMin, scale);
            scale = Math.min(that.options.zoomMax, scale);

            that.lastScale = scale / this.scale;

            newX = this.originX - this.originX * that.lastScale + this.x;
            newY = this.originY - this.originY * that.lastScale + this.y;
            newX = m.round(newX);
            newY = m.round(newY);

            this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

            if (that.options.onZoom) that.options.onZoom.call(that, e);
            return;
        }

/**/
        if (that.scrollerW > that.wrapperW) {            // contenu visible plus large que la fen�tre
            if (newX > 0) newX = 0;
            if (newX < that.maxScrollX) newX = that.maxScrollX;
        } else {
            newX = (that.wrapperW - that.scrollerW) / 2;
            newX = m.round(newX);
        }
        if (that.scrollerH > that.wrapperH) {            // contenu visible plus large que la fen�tre
            if (newY > that.minScrollY) newY = that.minScrollY;
            if (newY < that.maxScrollY) newY = that.maxScrollY;
        } else {
            newY = 0;
        }
/**/

        that.pointX = point.pageX;
        that.pointY = point.pageY;
if(0) {
        // Slow down if outside of the boundaries

        if (newX > 0 || newX < that.maxScrollX) {
            newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
        }
        if (newY > that.minScrollY || newY < that.maxScrollY) {
            newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
        }
}


        that.distX += deltaX;
        that.distY += deltaY;
        that.absDistX = m.abs(that.distX);
        that.absDistY = m.abs(that.distY);

        if (that.absDistX < 6 && that.absDistY < 6) {
            return;
        }
if (0) {
        // Lock direction
        if (that.options.lockDirection) {
            if (that.absDistX > that.absDistY + 5) {
                newY = that.y;
                deltaY = 0;
            } else if (that.absDistY > that.absDistX + 5) {
                newX = that.x;
                deltaX = 0;
            }
        }
}
        that.moved = true;
        //console.log('_posA');
        // SLA plus forc�ment n�cessaire
        newX = m.round(newX);
        newY = m.round(newY);
        // SLA
        that._pos(newX, newY);
        that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if (timestamp - that.startTime > 300) {
            that.startTime = timestamp;
            that.startX = that.x;
            that.startY = that.y;
        }
        
        if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
    },

/*
        // newX = position du coin gauche du contenu
        // maxScrollX est n�gatif et repr�sente la valeur de combien on peut d�caler le coin gauche avant d'afficher le bord droit
        // maxScrollX est positif si le contenu est plus petit que wrapper
        if (that.scrollerW > that.wrapperW) {
            if (newX > 450) {
                console.log('********************** bounce left ************************');
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] - Math.floor((Math.random() * 50) + 1);
                    if (t[0] < 0) t[0] = 0;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] - Math.floor((Math.random() * 50) + 1);
                    if (t[1] < 0) t[1] = 0;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] - Math.floor((Math.random() * 50) + 1);
                    if (t[2] < 0) t[2] = 0;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    that._end(e);
                    if (that.options.onSwipeLeft) that.options.onSwipeLeft.call(that, e);
                    return;
            }
            if (newX + 450 < that.maxScrollX) {
                console.log('********************** bounce right ************************');
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] + Math.floor((Math.random() * 50) + 1);
                    if (t[0] > 255) t[0] = 255;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] + Math.floor((Math.random() * 50) + 1);
                    if (t[1] > 255) t[1] = 255;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] + Math.floor((Math.random() * 50) + 1);
                    if (t[2] > 255) t[2] = 255;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    that._end(e);
                    if (that.options.onSwipeRight) that.options.onSwipeRight.call(that, e);
                    return;
            }
        } else {
            //console.log('newX='); console.log(newX);
            //console.log('that.maxScrollX='); console.log(that.maxScrollX);
            var centeredX = (that.wrapperW - that.scrollerW) / 2;
            //console.log('centeredX='); console.log(centeredX);
            if (centeredX - newX > 450) {
                console.log('********************** bounce left ************************');
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] - Math.floor((Math.random() * 50) + 1);
                    if (t[0] < 0) t[0] = 0;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] - Math.floor((Math.random() * 50) + 1);
                    if (t[1] < 0) t[1] = 0;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] - Math.floor((Math.random() * 50) + 1);
                    if (t[2] < 0) t[2] = 0;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    that._end(e);
                    if (that.options.onSwipeLeft) that.options.onSwipeLeft.call(that, e);
                    return;
            }
            if (centeredX - newX < -450) {
                console.log('********************** bounce right ************************');
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] + Math.floor((Math.random() * 50) + 1);
                    if (t[0] > 255) t[0] = 255;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] + Math.floor((Math.random() * 50) + 1);
                    if (t[1] > 255) t[1] = 255;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] + Math.floor((Math.random() * 50) + 1);
                    if (t[2] > 255) t[2] = 255;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    that._end(e);
                    if (that.options.onSwipeRight) that.options.onSwipeRight.call(that, e);
                    return;
            }
        }
 */
 
    _end: function (e) {
        /* touchend mouseup touchcancel mouseup */

        var that = this,
            point = /*hasTouch*/ (e.type == 'touchend' || e.type == 'touchcancel') ? e.changedTouches[0] : e,
            target, ev,
            momentumX = { dist:0, time:0 },
            momentumY = { dist:0, time:0 },
            duration = (e.timeStamp || Date.now()) - that.startTime,
            newPosX = that.x,
            newPosY = that.y,
            distX, distY,
            newDuration,
            snap,
            scale;
if (that.nBind > 1) {
    that.nBind = that.nBind - 1;
} else if (that.nBind == 0) {
return false;
} else {
    that.nBind = 0;
    that._unbind(/*MOVE_EV*/'touchmove', window); that._unbind('mousemove', window);
    that._unbind(/*END_EV*/'touchend', window); that._unbind('mouseup', window);
    that._unbind(/*CANCEL_EV*/'touchcancel', window); that._unbind('mouseup', window);
}
        if (/*hasTouch*/ (e.type == 'touchend' || e.type == 'touchcancel') && e.touches.length !== 0) return;
        if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

        if (that.zoomed) {
            //console.log('1');
            scale = that.scale * that.lastScale;
            scale = Math.max(that.options.zoomMin, scale);
            scale = Math.min(that.options.zoomMax, scale);
            that.lastScale = scale / that.scale;
            that.scale = scale;

            that.x = that.originX - that.originX * that.lastScale + that.x;
            that.y = that.originY - that.originY * that.lastScale + that.y;
            that.x = m.round(that.x);
            that.y = m.round(that.y);
            //setTimeout(function(){ // 20110501 Koniak Wait for the animation time + a bit before setting zoom to completed
                that.zoomed = false;
                that.refresh(true);            // we need to call resetPos() to ensure that.x and that.y are inside boundaries false);
            //},210); // 20110501 Koniak 

            //---
            
            /*that.scroller.style[transitionDuration] = '200ms';
            that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;*/
            if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
            return;
        }

        if (!that.moved) {
            //console.log('2');
            if (/*hasTouch*/ e.type == 'touchend' || e.type == 'touchcancel') {
                if (that.doubleTapTimer && that.options.zoom) {
                    // Double tapped
                    clearTimeout(that.doubleTapTimer);
                    that.doubleTapTimer = null;
                    if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    //that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                    that.zoom(that.pointX, that.pointY, null, 0, true);
                    if (that.options.onZoomEnd) {
                        setTimeout(function() {
                            that.options.onZoomEnd.call(that, e);
                        }, 200); // 200 is default zoom duration
                    }
                } else if (this.options.handleClick) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            //alert("click0");
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            target.dispatchEvent(ev);
                        }
                    }, that.options.zoom ? 250 : 0);
                }
            }
/*
            that._resetPos(400);
*/
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        console.log("that.scale="); console.log(that.scale);
        console.log("that.options.zoomMin="); console.log(that.options.zoomMin);
        var swipeDuration = (e.timeStamp || Date.now()) - that.swipeStartTime;
        /*$("#swipeDuration").html(swipeDuration);
        $("#swipeDurationMax").html(240);*/
        if (swipeDuration < 240 && that.scale == that.options.zoomMin) {            // on n'a pas besoin de distinguer un déplacement à l'intérieur de l'image d'un swipe, on peut donc swiper de manière plus permissive (pas de contrôle de déplacement vertical) 
            var dx1 = that.startPointX - point.pageX;
            dx1 = Math.round(dx1);
            var dx = Math.abs(dx1);
            var dxmin = singlePageWidth * that.scale;
            dxmin = Math.min(dxmin, $("#scroller").width());
            dxmin = dxmin / 5;
            dxmin = Math.round(dxmin);
            if (dxmin > 120) dxmin = 120;
            if (dx > dxmin) {
                if (dx1 > 0) {
                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    if (that.options.onSwipeLeft) that.options.onSwipeLeft.call(that, e);
                } else {
                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    if (that.options.onSwipeLeft) that.options.onSwipeRight.call(that, e);
                }
                return;
            }
        }
        // SLA
        if (swipeDuration < 240) {
/*console.log('move');
console.log('startPointX='); console.log(that.startPointX);            // start pageX
console.log(that.startPointY);                                    // start pageY
console.log('x='); console.log(point.pageX);
console.log(point.pageY);*/
            var dx1 = that.startPointX - point.pageX;
            dx1 = Math.round(dx1);
            var dx = Math.abs(dx1);
            var dy = Math.abs(that.startPointY - point.pageY);
            dy = Math.round(dy);
            $("#swipeDx").html(dx);
            $("#swipeDy").html(dy);
            // Triggered when a horizontal drag of 30px or more (and less than 30px vertically) occurs within 1 second duration but these can be configured
            // With that said, lets put ideas into action and see how to go about detecting a swipe right (from left to right). 
            // Once we can do that, detecting swipe in the other 3 directions is pretty much identical. 
            // For this exercise we'll stipulate that a right swipe has occurred when 
            // the user has moved his finger across the touch surface a minimum of 150px horizontally in 200 ms or less from left to right. 
            // Furthermore, there should be no more than 100px traveled vertically, to avoid "false positives" whereby the user swipes diagonally across, 
            // which we don't want to qualify as a swipe right.
            var dxmin = singlePageWidth * that.scale;
            dxmin = Math.min(dxmin, $("#scroller").width());
            dxmin = dxmin / 5;
            dxmin = Math.round(dxmin);
            $("#swipeDxMin").html(dxmin);
            if (dxmin > 120) dxmin = 120;
            // on va d�clencher si on parcourt 120 pixels ou 1/5 de page
            
            var dymax = pageHeight * that.scale;
            dymax = Math.min(dymax, $("#scroller").height());
            dymax = dymax / 14;
            //dymax = dxmin / 2;
            dymax = Math.round(dymax);
            $("#swipeDyMax").html(dymax);
            if (dymax > 60) dymax = 60;
            // on ne d�clenche pas si on parcourt 60 pixels ou 1/14 de page
            
            if (dx > dxmin && dy < dymax) {
                if (dx1 > 0) {
                    //console.log('************************** swipe left' + 'duration=' + swipeDuration + 'dx=' + dx1 + 'dy=' + dy);
                    /*
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] - Math.floor((Math.random() * 50) + 1);
                    if (t[0] < 0) t[0] = 0;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] - Math.floor((Math.random() * 50) + 1);
                    if (t[1] < 0) t[1] = 0;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] - Math.floor((Math.random() * 50) + 1);
                    if (t[2] < 0) t[2] = 0;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    */
                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    if (that.options.onSwipeLeft) that.options.onSwipeLeft.call(that, e);
                } else {
                    //console.log('************************** swipe right' + 'duration=' + swipeDuration + 'dx=' + dx1 + 'dy=' + dy);
                    /*
                    console.log($(that.scroller).css("backgroundColor"));
                    var s = $(that.scroller).css("backgroundColor");
                    console.log(s.length);
                    s = s.substring(4, s.length - 1);
                    console.log(s);
                    var t = s.split(", ");
                    console.log(t);
                    t[0] = parseInt(t[0]);
                    t[0] = t[0] + Math.floor((Math.random() * 50) + 1);
                    if (t[0] > 255) t[0] = 255;
                    
                    t[1] = parseInt(t[1]);
                    t[1] = t[1] + Math.floor((Math.random() * 50) + 1);
                    if (t[1] > 255) t[1] = 255;
                    
                    t[2] = parseInt(t[2]);
                    t[2] = t[2] + Math.floor((Math.random() * 50) + 1);
                    if (t[2] > 255) t[2] = 255;
                    
                    s = 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
                    $(that.scroller).css("backgroundColor", s);
                    */
                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    if (that.options.onSwipeLeft) that.options.onSwipeRight.call(that, e);
                }
            }
        }
        // SLA
        
        if (0) { //duration < 300 && that.options.momentum) {
            //console.log('3');
            momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
            momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

            newPosX = that.x + momentumX.dist;
            newPosY = that.y + momentumY.dist;

            if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
            if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
        }

        if (momentumX.dist || momentumY.dist) {
            newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                else {
                    snap = that._snap(newPosX, newPosY);
                    newPosX = snap.x;
                    newPosY = snap.y;
                    newDuration = m.max(snap.time, newDuration);
                }
            }

            that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        // Do we need to snap?
        if (that.options.snap) {
            distX = newPosX - that.absStartX;
            distY = newPosY - that.absStartY;
            if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
            else {
                snap = that._snap(that.x, that.y);
                if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
            }

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        //console.log('6');
/*
        that._resetPos(200);
*/
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
    },
    
    _resetPos: function (time) {
        //return;
        var that = this,
            resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
            resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;


            if (that.scrollerW <= that.wrapperW) {
                // if width to be displayed smaller than display width then center it
                resetX = (that.wrapperW - that.scrollerW) / 2;
                resetX = m.round(resetX);
                //console.log('adjust=' + resetX);
            }
            if (that.scrollerH <= that.wrapperH) {
                resetY = 0;
            }
            
        // SLA

        if (resetX == that.x && resetY == that.y) {
            if (that.moved) {
                that.moved = false;
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);        // Execute custom code on scroll end
            }

            if (that.hScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                that.hScrollbarWrapper.style.opacity = '0';
            }
            if (that.vScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                that.vScrollbarWrapper.style.opacity = '0';
            }

            return;
        }

        that.scrollTo(resetX, resetY, time || 0);
    },

    _wheel: function (e) {
        var that = this,
            wheelDeltaX, wheelDeltaY,
            deltaX, deltaY,
            deltaScale;

        if ('wheelDeltaX' in e) {
            wheelDeltaX = e.wheelDeltaX / 12;
            wheelDeltaY = e.wheelDeltaY / 12;
        } else if('wheelDelta' in e) {
            wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
        } else if ('detail' in e) {
            wheelDeltaX = wheelDeltaY = -e.detail * 3;
        } else {
            return;
        }
        
        if (that.options.wheelAction == 'zoom') {
            deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
            if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
            if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
            
            if (deltaScale != that.scale) {
                if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                that.wheelZoomCount++;
                
                that.zoom(e.pageX, e.pageY, deltaScale, 400);
                
                setTimeout(function() {
                    that.wheelZoomCount--;
                    if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                }, 400);
            }
            
            return;
        }
        
        deltaX = that.x + wheelDeltaX;
        deltaY = that.y + wheelDeltaY;

        if (deltaX > 0) deltaX = 0;
        else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

        if (deltaY > that.minScrollY) deltaY = that.minScrollY;
        else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
        if (that.maxScrollY < 0) {
            that.scrollTo(m.round(deltaX), m.round(deltaY), 0);
        }
    },
    
    _transitionEnd: function (e) {
        var that = this;

        if (e.target != that.scroller) return;

        that._unbind(TRNEND_EV);
        
        that._startAni();
    },


    /**
    *
    * Utilities
    *
    */
    _startAni: function () {
        // SLA
        //return;
        var that = this,
            startX = that.x, startY = that.y,
            startTime = Date.now(),
            step, easeOut,
            animate;
        console.log('_startAni');
        //console.log('that.x=' + that.x);
        //console.log('that.y=' + that.y);

        if (that.animating) {
            console.log('ani already running');
            return;
        }
        if (!that.steps.length) {
            console.log('empty steps');
            that._resetPos(400);
            return;
        }
        
        step = that.steps.shift();
        
        if (step.x == startX && step.y == startY) step.time = 0;
        
        that.animating = true;
        that.moved = true;
        
        if (that.options.useTransition) {
            console.log('useTransition');
            that._transitionTime(step.time);
        //console.log('_posE');
            that._pos(step.x, step.y);
            that.animating = false;
            if (step.time) {
                console.log('bind trnend');
                that._bind(TRNEND_EV);
            } else {
                that._resetPos(0);
            }
            return;
        }

        animate = function () {
            console.log('animate');
            var now = Date.now(),
                newX, newY;

            if (now >= startTime + step.time) {
        //console.log('_posD');
                that._pos(step.x, step.y);
                that.animating = false;
                if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);            // Execute custom code on animation end
                that._startAni();
                return;
            }

            now = (now - startTime) / step.time - 1;
            easeOut = m.sqrt(1 - now * now);
            newX = (step.x - startX) * easeOut + startX;
            newY = (step.y - startY) * easeOut + startY;
            newX = m.round(newX);
            newY = m.round(newY);
        //console.log('_posC');
            that._pos(newX, newY);
            if (that.animating) that.aniTime = nextFrame(animate);
        };

        animate();
    },

    _transitionTime: function (time) {
        time += 'ms';
        this.scroller.style[transitionDuration] = time;
        if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
        if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
    },

    _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
        var deceleration = 0.0006,
            speed = m.abs(dist) / time,
            newDist = (speed * speed) / (2 * deceleration),
            newTime = 0, outsideDist = 0;

        // Proportinally reduce speed if we are outside of the boundaries
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }

        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return { dist: newDist, time: m.round(newTime) };
    },

    _offset: function (el) {
        var left = -el.offsetLeft,
            top = -el.offsetTop;
            
        while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
        }
        
        if (el != this.wrapper) {
            left *= this.scale;
            top *= this.scale;
        }

        return { left: left, top: top };
    },

    _snap: function (x, y) {
        var that = this,
            i, l,
            page, time,
            sizeX, sizeY;

        // Check page X
        page = that.pagesX.length - 1;
        for (i=0, l=that.pagesX.length; i<l; i++) {
            if (x >= that.pagesX[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
        x = that.pagesX[page];
        sizeX = m.abs(x - that.pagesX[that.currPageX]);
        sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
        that.currPageX = page;

        // Check page Y
        page = that.pagesY.length-1;
        for (i=0; i<page; i++) {
            if (y >= that.pagesY[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
        y = that.pagesY[page];
        sizeY = m.abs(y - that.pagesY[that.currPageY]);
        sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
        that.currPageY = page;

        // Snap with constant speed (proportional duration)
        time = m.round(m.max(sizeX, sizeY)) || 200;

        return { x: x, y: y, time: time };
    },

    _bind: function (type, el, bubble) {
        (el || this.scroller).addEventListener(type, this, !!bubble);
    },

    _unbind: function (type, el, bubble) {
        (el || this.scroller).removeEventListener(type, this, !!bubble);
    },


    /**
    *
    * Public methods
    *
    */
    destroy: function () {
        var that = this;

        that.scroller.style[transform] = '';

        // Remove the scrollbars
        that.hScrollbar = false;
        that.vScrollbar = false;
        that._scrollbar('h');
        that._scrollbar('v');

        // Remove the event listeners
        that._unbind(RESIZE_EV, window);

        that._unbind(/*START_EV*/'touchstart'); that._unbind('mousedown');
        that._unbind(/*MOVE_EV*/'touchmove', window); that._unbind('mousemove', window);
        that._unbind(/*END_EV*/'touchend', window); that._unbind('mouseup', window);
        that._unbind(/*CANCEL_EV*/'touchcancel', window); that._unbind('mouseup', window);
        
        //if (!that.options.hasTouch) {
        if (that.options.wheelAction != 'none') {
            that._unbind('DOMMouseScroll');
            that._unbind('mousewheel');
        }
        //}
        
        if (that.options.useTransition) that._unbind(TRNEND_EV);
        
        if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
        
        if (that.options.onDestroy) that.options.onDestroy.call(that);
    },

    refresh: function (bResetPos) {
        // appelé à l'initialisation, sur changement du DOM, à la fin du zoom, sur resize
        if (typeof bResetPos == 'undefined') bResetPos = true;
        var that = this,
            offset,
            i, l,
            els,
            pos = 0,
            page = 0;

        if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
        that.wrapperW = that.wrapper.clientWidth || 1;
        //console.log('--------------that.wrapperW=' + that.wrapperW);
        that.wrapperH = that.wrapper.clientHeight || 1;

        that.minScrollY = -that.options.topOffset || 0;
        that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
        //console.log('--------------that.scrollerW=' + that.scrollerW);
        that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
        that.maxScrollX = that.wrapperW - that.scrollerW;
        that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
        that.dirX = 0;
        that.dirY = 0;

        if (that.options.onRefresh) that.options.onRefresh.call(that);

        that.hScroll = that.options.hScroll && that.maxScrollX < 0;
        that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

        that.hScrollbar = that.hScroll && that.options.hScrollbar;
        that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

        offset = that._offset(that.wrapper);
        that.wrapperOffsetLeft = -offset.left;
        that.wrapperOffsetTop = -offset.top;

        // Prepare snap
        if (typeof that.options.snap == 'string') {
            that.pagesX = [];
            that.pagesY = [];
            els = that.scroller.querySelectorAll(that.options.snap);
            for (i=0, l=els.length; i<l; i++) {
                pos = that._offset(els[i]);
                pos.left += that.wrapperOffsetLeft;
                pos.top += that.wrapperOffsetTop;
                that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
            }
        } else if (that.options.snap) {
            that.pagesX = [];
            while (pos >= that.maxScrollX) {
                that.pagesX[page] = pos;
                pos = pos - that.wrapperW;
                page++;
            }
            if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

            pos = 0;
            page = 0;
            that.pagesY = [];
            while (pos >= that.maxScrollY) {
                that.pagesY[page] = pos;
                pos = pos - that.wrapperH;
                page++;
            }
            if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
        }

        // Prepare the scrollbars
        that._scrollbar('h');
        that._scrollbar('v');
        if (!that.zoomed && bResetPos) {
            that.scroller.style[transitionDuration] = '0';
            that._resetPos(400);
        }
    },

    scrollTo: function (x, y, time, relative) {
        var that = this,
            step = x,
            i, l;

        that.stop();

        if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
        
        for (i=0, l=step.length; i<l; i++) {
            if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
            that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
        }
        //console.log(step);
        that._startAni();
    },

    scrollToElement: function (el, time) {
        var that = this, pos;
        el = el.nodeType ? el : that.scroller.querySelector(el);
        if (!el) return;

        pos = that._offset(el);
        pos.left += that.wrapperOffsetLeft;
        pos.top += that.wrapperOffsetTop;

        pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
        pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
        time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

        that.scrollTo(pos.left, pos.top, time);
    },

    scrollToPage: function (pageX, pageY, time) {
        var that = this, x, y;
        
        time = time === undefined ? 400 : time;

        if (that.options.onScrollStart) that.options.onScrollStart.call(that);

        if (that.options.snap) {
            pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
            pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

            pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
            pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

            that.currPageX = pageX;
            that.currPageY = pageY;
            x = that.pagesX[pageX];
            y = that.pagesY[pageY];
        } else {
            x = -that.wrapperW * pageX;
            y = -that.wrapperH * pageY;
            if (x < that.maxScrollX) x = that.maxScrollX;
            if (y < that.maxScrollY) y = that.maxScrollY;
        }

        that.scrollTo(x, y, time);
    },

    disable: function () {
        this.stop();
        this._resetPos(0);
        this.enabled = false;

        // If disabled after touchstart we make sure that there are no left over events
        this._unbind(/*MOVE_EV*/'touchmove', window); this._unbind('mousemove', window);
        this._unbind(/*END_EV*/'touchend', window); this._unbind('mouseup', window);
        this._unbind(/*CANCEL_EV*/'touchcancel', window); this._unbind('mouseup', window);
    },
    
    enable: function () {
        this.enabled = true;
    },
    
    stop: function () {
        if (this.options.useTransition) this._unbind(TRNEND_EV);
        else cancelFrame(this.aniTime);
        this.steps = [];
        this.moved = false;
        this.animating = false;
    },
    
/*
function xWrapper() {
        // as jquery ui dialog are scaled relative to document we must consider wrapper absolute position relative to document
        // images are scaled relative to wrapper
        if (oWrapper == null) oWrapper = $("#wrapper");
        var xWrapper;
        xWrapper = oWrapper.css("left");
        xWrapper = parseInt(xWrapper);
        return xWrapper;
}
function yWrapper() {
        if (oWrapper == null) oWrapper = $("#wrapper");
        var yWrapper;
        yWrapper = oWrapper.css("top");
        yWrapper = parseInt(yWrapper);
        return yWrapper;
}
*/
    /*setZoomMin: function(pageWidth, pageHeight) {
        var that = this;
        // Initial Scale fitToWidth
        //console.log(pageWidth);
        //console.log(pageHeight);
        //console.log(that.wrapper.clientWidth);
        //console.log(that.wrapper.clientHeight);
        scaleW = that.wrapper.clientWidth / pageWidth;
        scaleH = that.wrapper.clientHeight / pageHeight;
        if (scaleW < scaleH)
                that.options['zoomMin'] = scaleW;
        else
                that.options['zoomMin'] = scaleH;
        that.options['pageWidth'] = pageWidth;
        that.options['pageHeight'] = pageHeight;
        // that.options['zoomMin'] = 0.1;
    },*/

    contentChanged: function (pageWidth, pageHeight) {
        var that = this;
        if (typeof pageWidth != 'undefined') that.options['pageWidth'] = pageWidth;
        if (typeof pageHeight != 'undefined') that.options['pageHeight'] = pageHeight;
        this.setStartingPosition();
        this.refresh(false);
    },

    setStartingPosition: function () {
        var that = this;
        scaleW = that.wrapper.clientWidth / that.options['pageWidth'];
        scaleH = that.wrapper.clientHeight / that.options['pageHeight'];
        if (scaleW < scaleH)
            that.options['zoomMin'] = scaleW;
        else
            that.options['zoomMin'] = scaleH;
        //console.log('scaleW='+scaleW);
        //console.log('scaleH='+scaleH);
        //console.log('zoomMin='+that.options['zoomMin']);
        scale = that.options['zoomMin'];
        that.scale = scale;


        // Set starting position
        /*that.x = that.options.x;
        that.y = that.options.y;*/
        
        // SLA as we have a fixed width, avoid scroller to be recentered when refresh is called
        /*console.log('$(that.wrapper).width()=' + $(that.wrapper).width());
        console.log('$(that.scroller).width()=' + $(that.scroller).width());*/

        that.wrapperW = that.wrapper.clientWidth || 1;
        //console.log('--------------that.wrapperW=' + that.wrapperW);
        that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
        //console.log('--------------that.scrollerW=' + that.scrollerW);

        that.x = (that.wrapperW - that.scrollerW) / 2;        // ($(that.wrapper).width() - $(that.scroller).width()) / 2;
        that.x = m.round(that.x);
        //console.log(that.x);
        that.y = 0;

        //if (that.options.usemyDebugTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
        if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
        else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';
    },

    _resize: function () {
        return;
        var that = this;
        if (that.deferResizeID != null) {
            clearTimeout(that.deferResizeID);
            that.deferResizeID = null;
        }
        that.deferResizeID = setTimeout(function () {
            that.deferResizeID = null;
            that.__resize();
        }, 1200);    // isAndroid ? 200 : 0);
    },
    __resize: function () {
        var that = this;
        that.setStartingPosition();
        that.refresh(false);
    },

    //zoom: function (x, y, scale, time) {
    zoom: function (x, y, scale, time, doubleTap, forceZoom, bCenter) {
        var that = this;
        if (typeof doubleTap == 'undefined') doubleTap = false;
        if (typeof forceZoom == 'undefined') forceZoom = false;
        if (typeof bCenter == 'undefined') bCenter = false;

        //console.log('forceZoom='+forceZoom);
        //console.log('doubleTap='+doubleTap);
        if (forceZoom) {
            scale = that.options.zoomMax;
        } else if (doubleTap) {
        //console.log('that.scale='+that.scale);
        //console.log('that.options.zoomMin='+that.options.zoomMin);
        //console.log('that.options.zoomMax='+that.options.zoomMax);
        //console.log('that.options[pageWidth]='+that.options['pageWidth']);
            if (that.scale == that.options.zoomMax) { // unZoom
                scale = that.options.zoomMin;
            } else if (that.scale == that.options.zoomMin) { // zoom
                scale = that.wrapperW / that.options['pageWidth'];
                if (scale == that.options.zoomMin) scale = that.options.zoomMax;
            } else { // zoom
                scale = that.options.zoomMax;
            }
        } else { // Initial Scale fitToWidth    
        }

        // moved here from refresh()
        if (scale < that.options.zoomMin) scale = that.options.zoomMin;
        if (scale > that.options.zoomMax) scale = that.options.zoomMax;                // figaro le quotidien pleine page est sup?rieure ? zoomMax c'est ? dire 1 (figaro madame est en 1969 de large alors que le quotidien est en 1676 et mon ?cran est en 1920

        var relScale = scale / that.scale;

        if (!that.options.useTransform) return;

        var prevScale = that.scale;

        that.zoomed = true;
        time = time === undefined ? 200 : time;
        
        x = x - that.wrapperOffsetLeft - that.x;
        y = y - that.wrapperOffsetTop - that.y;
        that.x = x - x * relScale + that.x;
        that.y = y - y * relScale + that.y;
        that.x = m.round(that.x);
        that.y = m.round(that.y);
/*
        // x, y contient la position ou on a tap? dans la partie client du navigateur

        // x = nouvelle position absolue - wrapperOffset - position actuelle
        x = x - xWrapper() - that.x;
        y = y - yWrapper() - that.y;
        // x, y position dans l'image
        
        // x, y contient maintenant la position dans l'image ou on a tap? ? l'?chelle courante
        x = x / prevScale;
        y = y / prevScale;
        // x, y contient maintenant la position dans l'image ou on a tap? ? l'?chelle 1

        // admettons que l'on veuille faire de x, y le point central de l'?cran
        // pour faire en sorte qu'il soit forc?ment visible
        // x, y dans la nouvelle ?chelle
        x = x * scale;
        y = y * scale;
        that.x = x - (that.wrapperW / 2);
        that.y = y - (that.wrapperH / 2);
        that.x = that.x * -1;
        that.y = that.y * -1;
*/
        that.scale = scale;
        //console.log('***************scale=' + scale);
        that.refresh(false);            // ne fait pas le resetPos car zoomed == true

        var newX = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
        var newY = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

        //console.log('that.y=' + that.y);
        //console.log('that.minScrollY=' + that.minScrollY);
        //console.log('that.maxScrollY=' + that.maxScrollY);
        //console.log('newY=' + newY);

        //if (newY > 0) newY = 0;                // toujours cal� en haut
        that.x = newX;
        that.y = newY;
/*
        if (bCenter) {
            // center image
            that.x = (that.wrapperW - (pageWidth * scale)) / 2;
        } else if ((pageWidth * scale) < that.wrapperW) {
            // if width to be displayed smaller than display width then center it
            that.x = (that.wrapperW - (pageWidth * scale)) / 2;
        } else {
        }
*/    
        // SLA
            if (that.scrollerW <= that.wrapperW) {
                // if width to be displayed smaller than display width then center it
                that.x = (that.wrapperW - that.scrollerW) / 2;
                that.x = m.round(that.x);
                //console.log('adjust=' + that.x);
            }
            if (that.scrollerH <= that.wrapperH) {
                that.y = 0;
            }
        // SLA
        
        
        that.scroller.style[transitionDuration] = time + 'ms';
        that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
        that.zoomed = false;
    },
    
    isReady: function () {
        return !this.moved && !this.zoomed && !this.animating;
    }
};

function prefixStyle (style) {
    if ( vendor === '' ) return style;

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vendor + style;
}

dummyStyle = null;    // for the sake of it

if (typeof exports !== 'undefined') exports.iMyZoom = iMyZoom;        // iScroll = iScroll;
else window.iMyZoom = iMyZoom;        // iScroll = iScroll;

})(window, document);
