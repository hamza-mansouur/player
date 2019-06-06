// scroller is inside wrapper

mround = function (r) { return r >> 0; }


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

// Sentinel only var pageId;                        // currently displayed page id

//-------------------------------------------------------------------------------------------------------------------------------------------
function zoomInit(sSelector) {            // #wrapper
    //oZoom = new iMyZoom(sSelector.substr(1), { zoom:true, lockDirection:false });
    oZoom = new iMyZoom(sSelector.substr(1), { //zoom:true, lockDirection:false
        zoom:true,
        lockDirection:false,
        //snap: 'li',
        momentum: false,                // effet qui permet de lancer le scroll et de le continuer
        hScrollbar: false,
        vScrollbar: false,
        bounce: true,                    // effet qui permet d'aller plus loin que ce qui est affichable et de revenir
        bounceLock: false,                //  if set to true the scroller stops bouncing if the content is smaller than the visible area. Default: false (as per native iphone scroll).
        zoomMin: 0.5,
        zoomMax: 1,
        wheelAction: 'zoom',
        useTransition: true,
        hScroll: true,                    // sinon _pos remet x et y � 0
        vScroll: true,
        pageWidth: 600,
        pageHeight: 800,
        onSwipeLeft: function() {
            analyticsEventReaderPageSwipeLeft();
            nextPage();
            /*if ((nCurrent == nMax)||(doublePage&&!(nCurrent % 2)&&((nCurrent+1) == nMax))) {        // doublepage et page paire et suivante est la derni�re
               var nextParution = $('#h3_'+pCode+' ~ h3');
                if (nextParution.length>0){
                    //alert('next0');
                    nextPage();
                } else {
                }   
            } else {
                //alert('next0');
                nextPage();
            }*/
            //this.contentChanged();
        },
        onSwipeRight: function() {
            analyticsEventReaderPageSwipeRight();
            prevPage();
            //this.contentChanged();
        },
        onZoomStart: function (e) { onFirstZoomLoadHD(e); }        // InitLoadPagesOnFirstZoom(); }
    });
    return oZoom;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function setGlobalVariablesSizes(w, h, pw, ph, th) {                // pdfHeight":"771.02","pdfWidth":"595.28","thumb_height":259,"quartPageWidth":965,"quartPageHeight":1250
    quartWidth = w;
    quartHeight = h;
    mmPageWidth = pw;
    mmPageHeight = ph;
    thumbHeight = th;
    //mmPageWidth = mm;

    singlePageWidth = w * 2;
    pageHeight = h * 2;
    
    pageWidth = singlePageWidth;
    if (doublePage) {
        pageWidth = singlePageWidth * 2;
    }
    calculateRatio();    //pageWidth, pageHeight);
}

//alert("le bug c'est que l'on appelle setSizes mais pas setDoublePage mais une conséquence que lorsque page droite on hide page gauche et pas le contraire");

//-------------------------------------------------------------------------------------------------------------------------------------------
function setGlobalVariablesSingleDoublePageMode(dp) {
    myDebug("--- setGlobalVariablesSingleDoublePageMode");
    if (dp) myDebug("set double page mode");
    else myDebug("set single page mode");
    doublePage = dp;
}

function setGlobalVariablesPageWidth() {
    myDebug("--- setGlobalVariablesPageWidth");
    if (singlePageWidth == undefined) {
        myDebug("Unable to set page width, singlePageWidth is undefined");
    } else {
        pageWidth = singlePageWidth;
        if (doublePage) {
            pageWidth = singlePageWidth * 2;
        } else {
        }
        myDebug("set pageWidth=" + pageWidth);
        calculateRatio();    //pageWidth, pageHeight);
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function calculateRatio() {        //pageWidth, pageHeight) {
    myDebug("--- calculateRatio");
    //---

    // set bPortrait and bFitToWidth

    myDebug("must be set pageWidth=" + pageWidth);
    // comparons par rapport au portrait
    var ratioh297 = pageHeight / 297;
    var ratiow210 = pageWidth / 210;
    // il faut faire tenir l'ensemble � l'int�rieur donc on prend le plus gros ratio
    var ratio1;
    if (ratioh297 > ratiow210)
        ratio1 =  ratioh297;
    else
        ratio1 = ratiow210;
    // il nous faut calculer la surface qui sera utilis�e
    var h1 = pageHeight / ratio1;
    var w1 = pageWidth / ratio1;
    var s1 = h1 * w1;

    // comparons par rapport au paysage
    var ratioh210 = pageHeight / 210;
    var ratiow297 = pageWidth / 297;
    var ratio2;
    if (ratioh210 > ratiow297)
        ratio2 = ratioh210;
    else
        ratio2 = ratiow297;
    var h2 = pageHeight / ratio2;
    var w2 = pageWidth / ratio2;
    var s2 = h2 * w2;

    if (s1 > s2) {
        bPortrait = true;
    } else {
        bPortrait = false;
    }

    if (s1 > s2) {                // �a se joue entre h297 et w210
        if (ratioh297 > ratiow210) {
            bFitToWidth = false;
        } else {
            bFitToWidth = true;
        }
    } else {                        // �a se jour entre h210 et w297
        if (ratioh210 > ratiow297) {
            bFitToWidth = false;
        } else {
            bFitToWidth = true;
        }
    }

    //---
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function setPageCode(nl, nr) { // pc, rpc) {                // page010, null
	nPageLeft = nl;
	nPageRight = nr;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function setCSSImagesSize(sSelector) {
    myDebug("setCSSImagesSize");
    var oDiv = $(sSelector);
    var tImg = oDiv.find(".image-quart");
    myDebug("must be set quartWidth=" + quartWidth);
    myDebug("must be set quartHeight=" + quartHeight);
    tImg.css('width', quartWidth + 'px').css('height', quartHeight + 'px');
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function setCSSScrollerSize(sSelector, sSelectorScroller, myScroll) {
    myDebug("setCSSScrollerSize, must be called when pageWidth is changing");
    //myDebug("set size disabled"); return;
    var oDiv = $(sSelector);
    var oScroller = oDiv.find(sSelectorScroller);

    myDebug("must be set pageWidth=" + pageWidth);
    myDebug("must be set pageHeight=" + pageHeight);

    oScroller.css('width', pageWidth + 'px').css('height', pageHeight + 'px');

    /*myScroll.setZoomMin();
    myScroll.zoom(0, 0, myScroll.options.zoomMin, 0, false, false, true);*/
    
    /*myDebug("contentChanged 2");
    myScroll.contentChanged(pageWidth, pageHeight);*/
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, n) {					// "page%03p_%n.jpg", 1-4
    // sDomainExpr = "http://img%d.testpdfhighlight.t61p.fr:8081";
    // sImageDir = "/leKiosque/Lobs";
    // sImageExpr = "page%03p_%n.jpg"

	var urid = getURID(nCurrent);
	if (urid == null) return null;
	var s = urid + "_" + n + ".jpg";
	
    /*var sCurrent = "000" + nCurrent;
    sCurrent = sCurrent.slice(-3);
    // console.log("sCurrent=" + sCurrent);
    var s;
    s = sImageExpr;
    s = s.replace("%03p", sCurrent);
    s = s.replace("%n", n);*/
    // console.log("s=" + s);
    var d;
    d = sDomainExpr;
    d = d.replace("%d", n);
    // console.log("d=" + d);
    var t = d + sImageDir + "/" + s;
    // console.log("t=" + t);
    myDebug("buildImageName=" + t);
    return t;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function buildThumbName(nCurrent, sThumbDir, sThumbExpr, sDomainExpr) {				// // "page%03p.jpg"
    // sDomainExpr = "http://img%d.testpdfhighlight.t61p.fr:8081";
    // sThumbDir = "/leKiosque/Lobs";
    // sThumbExpr = "page%03p.jpg"


	var urid = getURID(nCurrent);
	if (urid == null) return null;
	var s = urid + ".jpg";



    /*var sCurrent = "000" + nCurrent;
    sCurrent = sCurrent.slice(-3);
    // console.log(sCurrent);
    var s = sThumbExpr;
    s = s.replace("%03p", sCurrent);*/
	
    // console.log(s);
    var d;
    d = sDomainExpr;
    d = d.replace("%d", 0);
    // console.log(d);
    var t = d + sThumbDir + "/" + s;
    // console.log(t);
    myDebug("buildThumbName=" + t);
    return t;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function getThumbDir(sThumbDir, sDomainExpr) {
    var d;
    d = sDomainExpr;
    d = d.replace("%d", 0);
    // console.log(d);
    var t = d + sThumbDir;
    // console.log(t);
    return t;
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function getThumbName(nCurrent, sThumbExpr) {						// "page%03p.jpg"
	var urid = getURID(nCurrent);
	if (urid == null) return null;
	var s = urid + ".jpg";
	
    /*var sCurrent = "000" + nCurrent;
    sCurrent = sCurrent.slice(-3);
    // console.log(sCurrent);
    var s = sThumbExpr;
    s = s.replace("%03p", sCurrent);*/
    // console.log(s);
    return s;
}


//-------------------------------------------------------------------------------------------------------------------------------------------
function imagePreloadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr) {
    myDebug('imagePreloadRight');
    analyticsViewPage(pCode, parutionDate, nCurrent);
    var oRoot = $(".liseuse-panel-block12");
    var wid = "container-page-list";
    var oW = oRoot.find("#" + wid);            // ".result-wrapper-container");
    var oSupplement = getSupplementFromID(oW, pCode);
    var oP = getPage(nCurrent, oSupplement);
    var sectionId = oP.attr("sectionId");
    var sectionName = null;
    if (sectionId != null) sectionName = pagesSections[sectionId];
    analyticsViewPageSection(pCode, parutionDate, sectionId, nCurrent, sectionName);

    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    /*var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);*/

    //var oDiv = $(sSelector);
    //console.log(oDiv);
    var oPage = oWrapper.find(".image-page-right");
    //console.log(oPage);
    var oImg = oPage.find(".image-quart-top-left");
    //console.log(oImg);

    var jpg = oImg.attr("src");
    myDebug("actual image=" + jpg);
    if (jpg1 != jpg) {
        imageLoadRightThumb(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr);
        // �viter de comparer le src mais plutoto un attribut car il faut que je rajoute aussi les attributs thumb pour le panneau de print
        // sert � charger les vignettes dans le dialog print
        var sDir = getThumbDir(sThumbDir, sDomainExpr);
        var sFile = getThumbName(nCurrent, sThumbExpr);
        oPage.attr("sThumbDir", sDir);
        oPage.attr("sThumbFile", sFile);
        
        oPage.attr("nPage", nCurrent);
        
        imageEmptyRight(oWrapper);
    } else {
        myDebug("image already loaded");
    }
}

var timerID = null;
//-------------------------------------------------------------------------------------------------------------------------------------------
function imageSetRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {        // save information to allow print before zoom
    myDebug('imageSetRight');
    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);
    var oPage = oWrapper.find(".image-page-right");
    oPage.attr("jpg1", jpg1);
    oPage.attr("jpg2", jpg2);
    oPage.attr("jpg3", jpg3);
    oPage.attr("jpg4", jpg4);
}

function imageLoadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    myDebug('imageLoadRight');
    if (bNotDelayed == undefined) bNotDelayed = false;

    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);

    //var oDiv = $(sSelector);
    //console.log(oDiv);
    var oPage = oWrapper.find(".image-page-right");
    //console.log(oPage);
    var oImg = oPage.find(".image-quart-top-left");
    //console.log(oImg);

    var jpg = oImg.attr("src");
    myDebug("actual image=" + jpg);
    if (jpg1 != jpg) {
        if (timerID != null) {
            myDebug('clear HD');
            clearTimeout(timerID);
            timerID = null;
        }
        if (bNotDelayed) {
            oImg.attr("src", jpg1);
            oImg = oPage.find(".image-quart-top-right");
            oImg.attr("src", jpg2);
            oImg = oPage.find(".image-quart-bottom-left");
            oImg.attr("src", jpg3);
            oImg = oPage.find(".image-quart-bottom-right");
            oImg.attr("src", jpg4);
            delayVisibility(oPage);
            /*var tImg = oPage.find(".image-quart");
            tImg.css("visibility", "visible");*/
        } else  {
            myDebug('delay HD');
            timerID = setTimeout(function () {
                myDebug('load HD');
                //return;
                oImg.attr("src", jpg1);
                oImg = oPage.find(".image-quart-top-right");
                oImg.attr("src", jpg2);
                oImg = oPage.find(".image-quart-bottom-left");
                oImg.attr("src", jpg3);
                oImg = oPage.find(".image-quart-bottom-right");
                oImg.attr("src", jpg4);
                delayVisibility(oPage);
                /*var tImg = oPage.find(".image-quart");
                tImg.css("visibility", "visible");*/
            }, bNotDelayed ? 0 : 550);
        }
    } else {
        myDebug("imageLoadRight, image already loaded, CSS visibility:visible");
        var tImg = oPage.find(".image-quart");
        tImg.css("visibility", "visible");
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imagePreloadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr) {
    myDebug('imagePreloadLeft');
    analyticsViewPage(pCode, parutionDate, nCurrent);
    var oRoot = $(".liseuse-panel-block12");
    var wid = "container-page-list";
    var oW = oRoot.find("#" + wid);            // ".result-wrapper-container");
    var oSupplement = getSupplementFromID(oW, pCode);
    var oP = getPage(nCurrent, oSupplement);
    var sectionId = oP.attr("sectionId");
    var sectionName = null;
    if (sectionId != null) sectionName = pagesSections[sectionId];
    analyticsViewPageSection(pCode, parutionDate, sectionId, nCurrent, sectionName);
    
    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    /*var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);*/

    //var oDiv = $(sSelector);
    var oPage = oWrapper.find(".image-page-left");
    //console.log(oPage);
    var oImg = oPage.find(".image-quart-top-left");
    //console.log(oImg);

    var jpg = oImg.attr("src");
    myDebug("actual image=" + jpg);
    if (jpg1 != jpg) {
        imageLoadLeftThumb(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr);
        // sert � charger les vignettes dans le dialog print
        var sDir = getThumbDir(sThumbDir, sDomainExpr);
        var sFile = getThumbName(nCurrent, sThumbExpr);
        oPage.attr("sThumbDir", sDir);
        oPage.attr("sThumbFile", sFile);

        oPage.attr("nPage", nCurrent);

        imageEmptyLeft(oWrapper);
    } else {
        myDebug("image already loaded");
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageSetLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {        // save information to allow print before zoom
    myDebug('imageSetLeft');
    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);
    var oPage = oWrapper.find(".image-page-left");
    oPage.attr("jpg1", jpg1);
    oPage.attr("jpg2", jpg2);
    oPage.attr("jpg3", jpg3);
    oPage.attr("jpg4", jpg4);
}
function imageLoadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    myDebug('imageLoadLeft');
    if (bNotDelayed == undefined) bNotDelayed = false;

    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    var jpg2 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 2);
    var jpg3 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 3);
    var jpg4 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 4);

    //var oDiv = $(sSelector);
    var oPage = oWrapper.find(".image-page-left");
    //console.log(oPage);
    var oImg = oPage.find(".image-quart-top-left");
    //console.log(oImg);

    var jpg = oImg.attr("src");
    myDebug("actual image=" + jpg);
    if (jpg1 != jpg) {
        if (timerID != null) {
            myDebug('clear HD');
            clearTimeout(timerID);
            timerID = null;
        }
        if (bNotDelayed) {
            oImg.attr("src", jpg1);
            oImg = oPage.find(".image-quart-top-right");
            oImg.attr("src", jpg2);
            oImg = oPage.find(".image-quart-bottom-left");
            oImg.attr("src", jpg3);
            oImg = oPage.find(".image-quart-bottom-right");
            oImg.attr("src", jpg4);
            delayVisibility(oPage);
            /*var tImg = oPage.find(".image-quart");
            tImg.css("visibility", "visible");*/
        } else  {
            myDebug('delay HD');
            timerID = setTimeout(function () {
                myDebug('load HD');
                //return;
                oImg.attr("src", jpg1);
                oImg = oPage.find(".image-quart-top-right");
                oImg.attr("src", jpg2);
                oImg = oPage.find(".image-quart-bottom-left");
                oImg.attr("src", jpg3);
                oImg = oPage.find(".image-quart-bottom-right");
                oImg.attr("src", jpg4);
                delayVisibility(oPage);
                /*var tImg = oPage.find(".image-quart");
                tImg.css("visibility", "visible");*/
            }, bNotDelayed ? 0 : 550);
        }
    } else {
        var tImg = oPage.find(".image-quart");
        tImg.css("visibility", "visible");
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageSetBoth(nLeft, nRight, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {        // save information to allow print before zoom
    var left1 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 1);
    var left2 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 2);
    var left3 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 3);
    var left4 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 4);

    var right1 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 1);
    var right2 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 2);
    var right3 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 3);
    var right4 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 4);

    var oPageLeft = oWrapper.find(".image-page-left");
    oPageLeft.attr("jpg1", left1);
    oPageLeft.attr("jpg2", left2);
    oPageLeft.attr("jpg3", left3);
    oPageLeft.attr("jpg4", left4);
    var oPageRight = oWrapper.find(".image-page-right");
    oPageRight.attr("jpg1", right1);
    oPageRight.attr("jpg2", right2);
    oPageRight.attr("jpg3", right3);
    oPageRight.attr("jpg4", right4);
}
function imageLoadBoth(nLeft, nRight, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    if (bNotDelayed == undefined) {
        bNotDelayed = false;
    }

    var left1 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 1);
    var left2 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 2);
    var left3 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 3);
    var left4 = buildImageName4(nLeft, sDomainExpr, sImageDir, sImageExpr, 4);

    var right1 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 1);
    var right2 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 2);
    var right3 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 3);
    var right4 = buildImageName4(nRight, sDomainExpr, sImageDir, sImageExpr, 4);

    //var oDiv = $(sSelector);
    var oPageLeft = oWrapper.find(".image-page-left");
    //console.log(oPage);
    var oImgLeft = oPageLeft.find(".image-quart-top-left");
    //console.log(oImg);
    var left = oImgLeft.attr("src");

    var oPageRight = oWrapper.find(".image-page-right");
    //console.log(oPage);
    var oImgRight = oPageRight.find(".image-quart-top-left");
    //console.log(oImg);
    var right = oImgRight.attr("src");

    myDebug("actual image=" + left);
    myDebug("actual image=" + right);
    if (left1 != left || right1 != right) {
        if (timerID != null) {
            myDebug('clear HD');
            clearTimeout(timerID);
            timerID = null;
        }
        myDebug('delay HD');
        timerID = setTimeout(function () {
            myDebug('load HD');
            //return;
            if (left1 != left) {
                oImgLeft.attr("src", left1);
                oImgLeft = oPageLeft.find(".image-quart-top-right");
                oImgLeft.attr("src", left2);
                oImgLeft = oPageLeft.find(".image-quart-bottom-left");
                oImgLeft.attr("src", left3);
                oImgLeft = oPageLeft.find(".image-quart-bottom-right");
                oImgLeft.attr("src", left4);
            }
            delayVisibility(oPageLeft);
            /*var tImg = oPageLeft.find(".image-quart");
            tImg.css("visibility", "visible");*/
            if (right1 != right) {
                oImgRight.attr("src", right1);
                oImgRight = oPageRight.find(".image-quart-top-right");
                oImgRight.attr("src", right2);
                oImgRight = oPageRight.find(".image-quart-bottom-left");
                oImgRight.attr("src", right3);
                oImgRight = oPageRight.find(".image-quart-bottom-right");
                oImgRight.attr("src", right4);
            }
            delayVisibility(oPageRight);
            /*var tImg = oPageRight.find(".image-quart");
            tImg.css("visibility", "visible");*/
        }, bNotDelayed ? 0 : 550);
    } else {
        myDebug("imageLoadBoth, images already loaded, CSS visibility:visible");
        var tImg = oPageLeft.find(".image-quart");
        tImg.css("visibility", "visible");
        var tImg = oPageRight.find(".image-quart");
        tImg.css("visibility", "visible");
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageLoadRightThumb(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr) {
    var s = buildThumbName(nCurrent, sThumbDir, sThumbExpr, sDomainExpr);
    var oPage = oWrapper.find(".image-page-right");
//    oPage.css("background-position", "top center");
//    oPage.css("background-size", "100%");
    oPage.css("background-image", "url(" + s + ")");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageLoadLeftThumb(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr) {
    var s = buildThumbName(nCurrent, sThumbDir, sThumbExpr, sDomainExpr);
    var oPage = oWrapper.find(".image-page-left");
//    oPage.css("background-position", "top center");
//    oPage.css("background-size", "100%");
    oPage.css("background-image", "url(" + s + ")");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageEmptyRight(oWrapper) {
    var oPage = oWrapper.find(".image-page-right");
    var tImg = oPage.find(".image-quart");
    tImg.attr("src", "css/icons/empty.png");
    tImg.css("visibility", "hidden");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageEmptyLeft(oWrapper) {
    var oPage = oWrapper.find(".image-page-left");
    var tImg = oPage.find(".image-quart");
    tImg.attr("src", "css/icons/empty.png");
    tImg.css("visibility", "hidden");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageEmptyRightThumb(oWrapper) {
    var oPage = oWrapper.find(".image-page-right");
    oPage.css("background-image", "none");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageEmptyLeftThumb(oWrapper) {
    var oPage = oWrapper.find(".image-page-left");
    oPage.css("background-image", "none");
}

//-------------------------------------------------------------------------------------------------------------------------------------------
// en mode single page un coup on affiche la droite un coup on affiche la gauche
function imageMakeVisible(nCurrent, oWrapper) {
    // single mode next page hide unnecessary page
    // single mode next page show needed page
    var oPage;

    if (nCurrent % 2) {                    // hide left one
        oPage = oWrapper.find(".image-page-left");
        var s = oPage.css("display");
        myDebug("actual CSS display=" + s);
        if (s == "inline-block") {
            myDebug("hide left page, display: none");
            oPage.css("display", "none");
        } else {
            myDebug("left page already hidden");
        }
    } else {
    }
    if (nCurrent % 2) {
    } else {                            // show left one
        oPage = oWrapper.find(".image-page-left");
        var s = oPage.css("display");
        myDebug("actual CSS display=" + s);
        if (s == "inline-block") {
            myDebug("left page already visible");
        } else {
            oPage.css("display", "inline-block");
            myDebug("show left page, display: inline-block");
        }
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageMakeLeftVisible(sSelector) {
    myDebug('imageMake---LEFT---Visible');
    var oWrapper = $(sSelector);
    var oPage;
    oPage = oWrapper.find(".image-page-left");
    var s = oPage.css("display");
    myDebug("actual CSS display=" + s);
    if (s == "inline-block") {
        myDebug("left page already visible");
    } else {
        oPage.css("display", "inline-block");
        myDebug("show left page, display: inline-block");
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function imageLoadSingle(nCurrent, sSelector, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    myDebug('imageLoadSingle');

    var oWrapper = $(sSelector);
    var oPage;
    if (nCurrent % 2) {
        oPage = oWrapper.find(".image-page-right");
    } else {
        oPage = oWrapper.find(".image-page-left");
    }

    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);

    var jpg = oPage.find(".image-quart-top-left").attr("src");
    myDebug("actual image=" + jpg);
if (jpg1 != jpg) {
    if (nCurrent % 2) {
        //imageLoadRightThumb(sSelector, sThumbDir, sThumb);
        imagePreloadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        // display the one that is needed
        imageMakeVisible(nCurrent, oWrapper);
        // hide the one that is no more needed
        //imageMakeInvisible(nCurrent, sSelector);
        // Don't Load High Res ------->
                //imageLoadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
                imageSetRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else {
        //imageLoadLeftThumb(sSelector, sThumbDir, sThumb);
        imagePreloadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        // display the one that is needed
        imageMakeVisible(nCurrent, oWrapper);
        // hide the one that is no more needed
        //imageMakeInvisible(nCurrent, sSelector);
        // Don't Load High Res ------->
                //imageLoadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
                imageSetLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    }

} else {
    myDebug("image already loaded");
    // display the one that is needed
    imageMakeVisible(nCurrent, oWrapper);
    // hide the one that is no more needed
    //imageMakeInvisible(nCurrent, sSelector);
}
        //startLoadImage(oPage, nCurrent, sSelector, 1);
}
function imageLoadHighSingle(nCurrent, sSelector, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    myDebug('imageLoadHighSingle');
    var oWrapper = $(sSelector);
    var oPage;
    if (nCurrent % 2) {
        oPage = oWrapper.find(".image-page-right");
    } else {
        oPage = oWrapper.find(".image-page-left");
    }
    var jpg1 = buildImageName4(nCurrent, sDomainExpr, sImageDir, sImageExpr, 1);
    var jpg = oPage.find(".image-quart-top-left").attr("src");
    myDebug("actual image=" + jpg);
    if (jpg1 != jpg) {
        if (nCurrent % 2) {
            imageLoadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
        } else {
            imageLoadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
        }
    } else {
        myDebug("image already loaded");
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------------
function imageLoadDouble(nCurrent, sSelector, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    var oWrapper = $(sSelector);
    if (nCurrent == 1) {
        imagePreloadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imageEmptyLeftThumb(oWrapper);
        imageEmptyLeft(oWrapper);
        imageSetRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else if (nCurrent == nMax) {
        imagePreloadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imageEmptyRightThumb(oWrapper);
        imageEmptyRight(oWrapper);
        imageSetLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else if ((nCurrent % 2)) {                // impaire donc elle va apparaitre � droite
        imagePreloadLeft(nCurrent - 1, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imagePreloadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imageSetBoth(nCurrent - 1, nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else {                            // paire donc elle va apparaitre � gauche
        imagePreloadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imagePreloadRight(nCurrent + 1, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr);
        imageSetBoth(nCurrent, nCurrent + 1, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    }
}
function imageLoadHighDouble(nCurrent, sSelector, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed) {
    myDebug('imageLoadHighDouble');
    var oWrapper = $(sSelector);
    if (nCurrent == 1) {
        myDebug('current is first');
        imageLoadRight(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else if (nCurrent == nMax) {
        myDebug('current is last');
        imageLoadLeft(nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else if ((nCurrent % 2)) {                // impaire donc elle va apparaitre � droite
        myDebug('current is impaire');
        imageLoadBoth(nCurrent - 1, nCurrent, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    } else {                            // paire donc elle va apparaitre � gauche
        myDebug('current is paire');
        imageLoadBoth(nCurrent, nCurrent + 1, oWrapper, sThumbDir, sThumbExpr, sDomainExpr, sImageDir, sImageExpr, bNotDelayed);
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------------
var timeoutLoadImage = null;            // must be replaced with an array and iIndex be used to store the timer ID

function fnLoadImage(oPage, nCurrent, sSelector, iIndex, nCount) {
    timeoutLoadImage = null;
    myDebug("timeoutLoadImage");
    myDebug("fnLoadImage nCurrent="+nCurrent);
    var bEnded = true;
    var t = oPage.find(".image-quart");
    t.each(function () {
        myDebug("complete="+$(this).get(0).complete);
        myDebug("naturalWidth="+$(this).get(0).naturalWidth);
        if (!$(this).get(0).complete) bEnded = false;
    });
    if (!bEnded) {
        myDebug("not loaded");
        myDebug("timeout="+nCount);
        /*timeoutLoadImage = */setTimeout(fnLoadImage, 250, oPage, nCurrent, sSelector, iIndex, nCount + 1);
    } else {
        myDebug("loaded");

        // hide the one that is no more needed
        imageMakeInvisible(nCurrent, sSelector);
        // display the one that is needed
        imageMakeVisible(nCurrent, sSelector);

    }
}

var nTimeoutLoadImage = 250;

function startLoadImage(oPage, nCurrent, sSelector, iIndex) {
    myDebug("startLoadImage nCurrent="+nCurrent);
    setTimeout(fnLoadImage, nTimeoutLoadImage, oPage, nCurrent, sSelector, iIndex, 1);
}

function fnDelayVisibility(oPage) {
    myDebug("fnDelayVisibility");
    var bEnded = true;
    var t = oPage.find(".image-quart");
    t.each(function () {
        //myDebug("complete="+$(this).get(0).complete);
        //myDebug("naturalWidth="+$(this).get(0).naturalWidth);
        if (!$(this).get(0).complete) bEnded = false;
    });
    if (!bEnded) {
        myDebug("setTimeout fnDelayVisibility");
        setTimeout(fnDelayVisibility, 150, oPage);
    } else {
        myDebug("stopTimeout fnDelayVisibility");
        t.css("visibility", "visible");
    }
}

function delayVisibility(oPage) {
    myDebug("delayVisibility");
    myDebug("setTimeout fnDelayVisibility");
    setTimeout(fnDelayVisibility, 150, oPage);
}