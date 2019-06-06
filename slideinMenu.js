/**
 * 
 * Find more about the slide down menu at
 * http://cubiq.org/slide-in-menu
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 0.1beta1 - Last updated: 2010.05.28
 * 
 */

var bMouseDebug = false;            // m'a permis d'utiliser la souris sur Chrome PC pour debugger les codes touchStart, touchMove lorsque j'ai autorisé de mettre le menu en bas et qu'il s'ouvre vers le haut

var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
        (/trident/i).test(navigator.userAgent) ? 'ms' :
        'opera' in window ? 'O' : '';

function slideInMenu (el, opened, direction) {
    this.container = document.getElementById(el);
    this.handle = this.container.querySelector('.handle');
    this.content = this.container.querySelector('.content');
    this.direction = direction;

    this.container.style.opacity = '1';
    this.container.style[vendor + 'TransitionProperty'] = '-' + vendor.toLowerCase() + '-transform';
    this.container.style[vendor + 'TransitionDuration'] = '400ms';


    if (this.handle.addEventListener){
      this.handle.addEventListener('touchstart', this);
    } else if (this.handle.attachEvent) {
      this.handle.attachEvent('ontouchstart', this);
    }
    if (bMouseDebug) {
        if (this.handle.addEventListener){
          this.handle.addEventListener('mousedown', this);
        } else if (this.handle.attachEvent) {
        }
    } else {
        if (this.handle.addEventListener){
          this.handle.addEventListener('click', this);
        } else if (this.handle.attachEvent) {
          this.handle.attachEvent('onclick', this);
        }
    }
}

slideInMenu.prototype = {
    pos: 0,
    opened: false,
    //up: true,
    direction: 0,
    
    handleEvent: function(e) {
        //console.log('slideInMenu event '+e.type);
        switch (e.type) {
            case 'touchstart': this.touchStart(e); break;
            case 'mousedown': this.touchStart(e); break;
            case 'touchmove': this.touchMove(e); break;
            case 'mousemove': this.touchMove(e); break;
            case 'touchend': this.touchEnd(e); break;
            case 'mouseup': this.touchEnd(e); break;
            // ? mouseout, mouseover
            //case 'dblclick': this.dblclick(e); break;
            case 'click': this.dblclick(e); break;
        }        
    },
    
    setPosition: function(pos) {
        this.pos = pos;
        if (this.direction == 1) //up)
            pos = -1 * pos;
        if (this.direction == 2)
            this.container.style[vendor + 'Transform'] = 'translate3d(' + pos + 'px,0,0)';        // use transform to show or hide
        else
            this.container.style[vendor + 'Transform'] = 'translate3d(0,' + pos + 'px,0)';        // use transform to show or hide
        
        //var openedPosition = this.content.clientHeight - this.handle.clientHeight;
        //console.log('openedPosition='+openedPosition);
        //if (this.pos == this.openedPosition) {
        //if (this.pos == openedPosition) {
        //    this.opened = true;
        /*} else */
        if (this.pos == 0) {
            this.opened = false;
        } else {        // SLA
            this.opened = true;
        }
    },
    
    touchStart: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.container.style[vendor + 'TransitionDuration'] = '0';
        this.startPos = this.pos;
        if (bMouseDebug) {
            if (this.direction == 2) {
                this.leftDelta = e.pageX;
                this.startDelta = e.pageX - this.pos;
            } else if (this.direction == 1) { //up) {
                this.upDelta = e.pageY;                // on prend le point de repère du début du mouvement
                this.startDelta = 0 - this.pos;        // on utilise 0 ce qui marche très bien, le tout c'est de pouvoir calculer l'écart de position lors du touchMove
            } else {
                this.startDelta = e.pageY - this.pos;
            }
        } else {
            if (this.direction == 2) {
                this.leftDelta = e.touches[0].pageX;
                this.startDelta = e.touches[0].pageX - this.pos;
            } else if (this.direction == 1) { //up) {
                this.upDelta = e.touches[0].pageY;
                this.startDelta = 0 - this.pos;
            } else {
                this.startDelta = e.touches[0].pageY - this.pos;
            }
        }
        this.handle.addEventListener('touchmove', this);
        this.handle.addEventListener('touchend', this);
        if (bMouseDebug) {
            this.handle.addEventListener('mousemove', this);
            this.handle.addEventListener('mouseup', this);
        }
    },
    
    touchMove: function(e) {
        var delta;
        if (bMouseDebug) {
            if (this.direction == 2) {
                delta = e.pageX - this.startDelta;
            } else if (this.direction == 1) { //up) {
                delta = (e.pageY - this.upDelta) * -1 - this.startDelta;
            } else {
                delta = e.pageY - this.startDelta;
            }
        } else {
            if (this.direction == 2) {
                delta = e.touches[0].pageX - this.startDelta;
            } else if (this.direction == 1) { //up) {
                delta = (e.touches[0].pageY - this.upDelta) * -1 - this.startDelta;
            } else {
                delta = e.touches[0].pageY - this.startDelta;
            }
        }

        var openedPosition;
        if (this.direction == 2) {
            openedPosition = this.content.clientWidth - this.handle.clientWidth;
        } else {
            openedPosition = this.content.clientHeight - this.handle.clientHeight;
        }
        if (delta < 0) {
            delta = 0;
        } else if (delta > openedPosition) {
            delta = openedPosition;
        }
        this.setPosition(delta);
    },
    
    touchEnd: function(e) {
        myDebug("touchEnd");
        var strokeLength = this.pos - this.startPos;
        strokeLength *= strokeLength < 0 ? -1 : 1;
        
        var openedPosition;
        if (this.direction == 2) {
            openedPosition = this.content.clientWidth - this.handle.clientWidth;
        } else {
            openedPosition = this.content.clientHeight - this.handle.clientHeight;
        }
        if (strokeLength > 3) {        // It seems that on Android is almost impossibile to have a tap without a minimal shift, 3 pixels seems a good compromise
            this.container.style[vendor + 'TransitionDuration'] = '10ms';//'200ms';
            if (this.pos==openedPosition || !this.opened) {
                this.setPosition(this.pos > openedPosition/3 ? openedPosition : 0);
            } else {
                this.setPosition(this.pos > openedPosition ? openedPosition : 0);
            }
        } else {
            this.container.style[vendor + 'TransitionDuration'] = '200ms';//'400ms';
            this.setPosition(!this.opened ? openedPosition : 0);
        }

        this.handle.removeEventListener('touchmove', this);
        this.handle.removeEventListener('touchend', this);
        if (bMouseDebug) {
            this.handle.removeEventListener('mousemove', this);
            this.handle.removeEventListener('mouseup', this);
        }
    },
    
    dblclick: function(e) {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    },
    
    open: function() {
        var openedPosition;
        if (this.direction == 2)
            openedPosition = this.content.clientWidth - this.handle.clientWidth;
        else
            openedPosition = this.content.clientHeight - this.handle.clientHeight;
        this.setPosition(openedPosition);                                // show using transform
    },

    close: function() {
        this.setPosition(0);                                // hide using transform
    },
    
    toggle: function() {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    },

    showPanel: function () {
        this.container.style.visibility = 'visible';
    },
    
    // we assume that we use display: none and not visibility: hidden in page
    // this avoid having bad display effect as we show div only we everything is initialized
    
    adjustClosePosition: function() {        // set left, bottom or top CSS property     resetHeight: function() {            // div content has changed, negative position must be changed
        var openedPosition;
        if (this.direction == 2)
            openedPosition = this.content.clientWidth - this.handle.clientWidth;
        else
            openedPosition = this.content.clientHeight - this.handle.clientHeight;
if (0) {
        var bDisplayed = true;
        if (this.container.style.display == "none") bDisplayed = false;

        if (!bDisplayed) {
            this.container.style.visibility = 'hidden';                // <div id="slidedownmenu" style="position: absolute; width: 100%; left: 0; display: none;"> <img width="1" height="500" />
            this.container.style.display = '';                // <div id="slidedownmenu" style="position: absolute; width: 100%; left: 0; display: none;"> <img width="1" height="500" />
        }
        // si display none alors openedPosition = 0
        var openedPosition;
        if (this.direction == 2)
            openedPosition = this.content.scrollWidth - this.handle.scrollWidth;
        else
            openedPosition = this.content.scrollHeight - this.handle.scrollHeight;
        if (!bDisplayed) {
            this.container.style.display = 'none';                // <div id="slidedownmenu" style="position: absolute; width: 100%; left: 0; display: none;"> <img width="1" height="500" />
            this.container.style.visibility = 'visible';                // <div id="slidedownmenu" style="position: absolute; width: 100%; left: 0; display: none;"> <img width="1" height="500" />
        }
}
        //console.log('this.content.scrollHeight='+this.content.scrollHeight);
        //console.log('this.handle.scrollHeight='+this.handle.scrollHeight);
        //console.log('openedPosition='+openedPosition);
        if (this.direction == 2) {
            this.container.style.left = '-' + openedPosition + 'px';
        } else if (this.direction == 1) {
            this.container.style.bottom = '-' + openedPosition + 'px';
        } else {
            this.container.style.top = '-' + openedPosition + 'px';
        }
    },

    adjustOpenPosition: function() {            // set translateX or translateY            resetAdjustOpen: function() {            // div content has changed, open a little bit more if opened and height higher
        if (this.opened) {                            // we assume display is not none
            var openedPosition;
            if (this.direction == 2) {
                openedPosition = this.content.scrollWidth - this.handle.scrollWidth;
            } else  {
                openedPosition = this.content.scrollHeight - this.handle.scrollHeight;
            }
            this.setPosition(openedPosition);
        }
    }
}
