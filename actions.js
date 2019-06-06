$(document).ready(function() {
    $('.slideleftmenu').find('.subhandle').each(function() {
        var playerColor = $(this).attr('playerColor');
        if (playerColor.indexOf("black") >= 0) {
            $(this).addClass('greenSubHandleBlack');
        } else {
            $(this).addClass('greenSubHandleWhite');
        }
    });
    $('.slideupmenu').find('.subhandle').each(function() {
        var playerColor = $(this).attr('playerColor');
        if (playerColor.indexOf("black") >= 0) {
            $(this).addClass('iconOpenBlack');
        } else {
            $(this).addClass('iconOpenWhite');
        }
    });
});

function loadCurrentParution(code) {
    myDebug('--- loadCurrentParution');
    myDebug("set current parution code, 4, pCode=" + code);
    if (pCode == undefined) {
        myDebug("first time we set parution code");
    } else {
        myDebug("previous current parution code was " + pCode);
    }
    // Est ce que l'on navigue dans le chemin de fer ou dans un résultat de recherche plein-texte ?
    var oRoot = $(".liseuse-panel-block12");
    var oActiveWrapper = oRoot.find(".result-wrapper-container.active");
    var id = oActiveWrapper.attr("id");
    if (id == "container-page-list") {
    } else if (id == "container-search-results") {
    } else {
    }
    var oSupplement = oActiveWrapper.find(".supplement-items[id='" + code + "']");
    pCode = code;
    nMax = oSupplement.attr("nPages");// plan[code].length;
    //sThumbDir = dataDir+"/"+$("#h3_"+pCode).attr('repository')+'/'+sThSubFolder+'/';
    //sImageDir = dataDir+"/"+$("#h3_"+pCode).attr('repository')+'/jpg4/';
    sThumbDir = oSupplement.attr("sThumbDir");// + "/";
    sImageDir = oSupplement.attr("sImageDir");// + "/";

    var qW = parseInt(oSupplement.attr("quartPageWidth"));
    var qH = parseInt(oSupplement.attr("quartPageHeight"));
    var pdfW = parseFloat(oSupplement.attr("pdfWidth"));
    var pdfH = parseFloat(oSupplement.attr("pdfHeight"));
    var tH = parseInt(oSupplement.attr("pageThumbHeight"));


    //setSizes(965, 1250, 595.28, 771.02, 259);// pdfHeight":"771.02","pdfWidth":"595.28","thumb_height":259,"quartPageWidth":965,"quartPageHeight":1250
    //setSizes(parseInt($("#"+pCode).attr('quartPageWidth')), parseInt($("#"+pCode).attr('quartPageHeight')), parseFloat($("#"+pCode).attr('pdfWidth')), parseFloat($("#"+pCode).attr('pdfHeight')), parseInt($("#"+pCode).attr('pageThumbHeight')));
    setGlobalVariablesSizes(qW, qH, pdfW, pdfH, tH);
    // fait maintenant dans setSizes() setDoublePage(doublePage);        // utilise singlePageWidth donc doit être appelé après setSizes()
    setCSSImagesSize("#wrapper");
    setCSSScrollerSize("#wrapper", "#scroller", myScroll);
    //_loadCurrentPage();
}

function _loadCurrentPage(bNotDelayed) {
    highlightsRemove();
    if (doublePage) {
        var sSelector = "#wrapper";
        var oWrapper = $(sSelector);
        imageEmptyLeft(oWrapper);
        imageEmptyRight(oWrapper);
        imageEmptyLeftThumb(oWrapper);
        imageEmptyRightThumb(oWrapper);
    } else {
        var sSelector = "#wrapper";
        var oWrapper = $(sSelector);
        imageEmptyLeft(oWrapper);
        imageEmptyRight(oWrapper);
        imageEmptyLeftThumb(oWrapper);
        imageEmptyRightThumb(oWrapper);
    }
    myScroll.contentChanged(pageWidth, pageHeight);
    displayPrevNav();
    if (doublePage) {
            // display the one that is needed
        // on doit dŽterminer si la page courante est paire ou impaire
        if (nCurrent == 1) {
            setPageCode(null, nCurrent);//"page" + left_pad(nCurrent,3));
        // on ne peut pas comparer un folio avec un nombre de pages    
        } else if (nCurrent == nMax) {
            setPageCode(nCurrent, null);//"page" + left_pad(nCurrent,3), null);
        } else if ((nCurrent % 2)) {                // impaire donc elle va apparaitre ˆ droite
            setPageCode(nCurrent - 1, nCurrent);//"page" + left_pad((nCurrent - 1),3), "page" + left_pad(nCurrent,3));
        } else {                            // paire donc elle va apparaitre ˆ gauche
            setPageCode(nCurrent, nCurrent + 1);//"page" + left_pad(nCurrent,3), "page" + left_pad((nCurrent + 1),3));
        }
        imageLoadDouble(nCurrent, "#wrapper", sThumbDir, "page%03p.jpg", sDomainExpr, sImageDir, "page%03p_%n.jpg", bNotDelayed);

    } else {
        setPageCode(nCurrent, null);//"page" + left_pad(nCurrent,3), null);
        imageLoadSingle(nCurrent, "#wrapper", sThumbDir, "page%03p.jpg", sDomainExpr, sImageDir, "page%03p_%n.jpg", bNotDelayed);
    }
    displayNextNav();
    kloadHighlight(HighLightsdata);
    displayZoning();
}

    /*if (doublePage) {
        myDebug('double page');
            // display the one that is needed
        // on doit dŽterminer si la page courante est paire ou impaire
        if (nCurrent == 1) {
            myDebug('current is first');
            displayPrevNav();
            setPageCode(null, "page" + left_pad(nCurrent,3));
            imageEmptyAllLeft("#wrapper");
            imageLoadRight("#wrapper", sThumbDir, "page" + left_pad(nCurrent,3) + ".jpg", sImageDir, "page" + left_pad(nCurrent,3) + "_1.jpg", "page" + left_pad(nCurrent,3) + "_2.jpg", "page" + left_pad(nCurrent,3) + "_3.jpg", "page" + left_pad(nCurrent,3) + "_4.jpg");
            displayNextNav();
        } else if (nCurrent == nMax) {
            myDebug('current is last');
            displayPrevNav();
            setPageCode("page" + left_pad(nCurrent,3), null);
            imageEmptyAllRight("#wrapper");
            imageLoadLeft("#wrapper", sThumbDir, "page" + left_pad(nCurrent,3) + ".jpg", sImageDir, "page" + left_pad(nCurrent,3) + "_1.jpg", "page" + left_pad(nCurrent,3) + "_2.jpg", "page" + left_pad(nCurrent,3) + "_3.jpg", "page" + left_pad(nCurrent,3) + "_4.jpg");
            displayNextNav();
        } else if ((nCurrent % 2)) {                // impaire donc elle va apparaitre ˆ droite
            myDebug('current is impaire');
            displayPrevNav();
            setPageCode("page" + left_pad((nCurrent - 1),3), "page" + left_pad(nCurrent,3));
            imageLoadLeft("#wrapper", sThumbDir, "page" + left_pad((nCurrent - 1),3) + ".jpg", sImageDir, "page" + left_pad((nCurrent - 1),3) + "_1.jpg", "page" + left_pad((nCurrent - 1),3) + "_2.jpg", "page" + left_pad((nCurrent - 1),3) + "_3.jpg", "page" + left_pad((nCurrent - 1),3) + "_4.jpg");
            imageLoadRight("#wrapper", sThumbDir, "page" + left_pad(nCurrent,3) + ".jpg", sImageDir, "page" + left_pad(nCurrent,3) + "_1.jpg", "page" + left_pad(nCurrent,3) + "_2.jpg", "page" + left_pad(nCurrent,3) + "_3.jpg", "page" + left_pad(nCurrent,3) + "_4.jpg");
            displayNextNav();
        } else {                            // paire donc elle va apparaitre ˆ gauche
            myDebug('current is paire');
            displayPrevNav();
            setPageCode("page" + left_pad(nCurrent,3), "page" + left_pad((nCurrent + 1),3));
            imageLoadLeft("#wrapper", sThumbDir, "page" + left_pad(nCurrent,3) + ".jpg", sImageDir, "page" + left_pad(nCurrent,3) + "_1.jpg", "page" + left_pad(nCurrent,3) + "_2.jpg", "page" + left_pad(nCurrent,3) + "_3.jpg", "page" + left_pad(nCurrent,3) + "_4.jpg");
            imageLoadRight("#wrapper", sThumbDir, "page" + left_pad((nCurrent + 1),3) + ".jpg", sImageDir, "page" + left_pad((nCurrent + 1),3) + "_1.jpg", "page" + left_pad((nCurrent + 1),3) + "_2.jpg", "page" + left_pad((nCurrent + 1),3) + "_3.jpg", "page" + left_pad((nCurrent + 1),3) + "_4.jpg");
            displayNextNav();
        }
    } else {
        myDebug('simple page');
        displayPrevNav();
        setPageCode("page" + left_pad(nCurrent,3), null);
        imageLoadSingle(nCurrent, "#wrapper", sThumbDir, "page" + left_pad(nCurrent,3) + ".jpg", sImageDir, "page" + left_pad(nCurrent,3) + "_1.jpg", "page" + left_pad(nCurrent,3) + "_2.jpg", "page" + left_pad(nCurrent,3) + "_3.jpg", "page" + left_pad(nCurrent,3) + "_4.jpg");
        if ((nCurrent % 2)) {
            imageEmptyAllLeft("#wrapper");
        } else {
            imageEmptyAllRight("#wrapper");
        }
        displayNextNav();
    }*/

function activateWrapper(wid) {
    myDebug("activateWrapper " + wid);
    var oActiveWrapper = getActiveWrapper();
    if (oActiveWrapper != null) {
        myDebug("désactive le wrapper actif");
        oActiveWrapper.removeClass("active");
    } else {
        myDebug("pas de wrapper actif");
    }
    //var oNewWrapper = $("#" + wid);
    // faire une fonction getRoot
    var oRoot = $(".liseuse-panel-block12");
    //myDebug(oRoot);
    var oWrappers = oRoot.find(".result-wrapper-container");
    //myDebug(oWrappers);
    /*var oActiveWrapper = oWrappers.filter(".active");
    myDebug(oActiveWrapper);
    if (oActiveWrapper.length > 0) {
    } else {
        myDebug("no wrapper active");
    }*/
    myDebug("active le wrapper " + wid);
    var oNewWrapper = oWrappers.filter("#" + wid);
    oNewWrapper.addClass("active");
    if (wid == "container-page-list") {                // tous les suppléments et toutes les pages sont présentes
    } else if (wid == "container-search-results") {        // contenu réduit
    } else {
    }
    return oNewWrapper;
}

function syncWrapper() {
    syncWrapperPagesList();
    syncWrapperSearchResults();
}

function syncWrapperSearchResults() {
    var oContainer = $("#container-search-results");
    if (!oContainer.hasClass("active")) {
        return false;
    }
    // à revoir
    oContainer.find(".thumbPage").removeClass('thumb-selected').removeClass('thumb-selected-left').removeClass('thumb-selected-right');
    var id = "#" + pCode + "_page" + left_pad(nCurrent,3);
    //myDebug(id);
    var oDiv = oContainer.find(id);
    //myDebug(oDiv);
    if (oDiv.length > 0) {
        if (!doublePage) {
            oDiv.addClass('thumb-selected');
        // thumb-odd+first thumb-even thumb-odd thumb-even+last
        } else if (oDiv.hasClass("thumb-even") && !oDiv.hasClass("thumb-last")) {
            oDiv.addClass('thumb-selected-left');
            // find next sibling
            oDiv.next().addClass('thumb-selected-right');
        } else if (oDiv.hasClass("thumb-odd") && !oDiv.hasClass("thumb-first")) {
            oDiv.addClass('thumb-selected-right');
            // find prev sibling
            oDiv.prev().addClass('thumb-selected-left');
        } else {
            oDiv.addClass('thumb-selected');
        }
        //oScrollerSearchResults.centerToElement($(oDiv)[0], 0);
        var wid = "container-search-results";
        // refresh is timeouted so centerToElement must be also
        setTimeout(function() {
            tScroller[wid].centerToElement(oDiv[0], 500);        // $(oDiv)[0], 0);
        }, 0);
    }
    return true;
}

function syncWrapperPagesList() {
    myDebug("syncWrapperPagesList");
    //$(".supplement-items .thumbPage IMG").removeClass('selectedPage');
    //$(".supplement-items .thumbPage").removeClass('thumb-selected').removeClass('thumb-selected-left').removeClass('thumb-selected-right');
    var oContainer = $("#container-page-list");
    if (!oContainer.hasClass("active")) {
        myDebug("container-page-list not active");
        return false;
    }
    // à revoir
    oContainer.find(".thumbPage").removeClass('thumb-selected').removeClass('thumb-selected-left').removeClass('thumb-selected-right');
    var id = "#" + pCode + "_page" + left_pad(nCurrent,3);
    //myDebug(id);
    //var oDiv = $(id);
    var oDiv = oContainer.find(id);
    //myDebug(oDiv);
    if (oDiv.length > 0) {
        if (!doublePage) {
            oDiv.addClass('thumb-selected');
        // thumb-odd+first thumb-even thumb-odd thumb-even+last
        } else if (oDiv.hasClass("thumb-even") && !oDiv.hasClass("thumb-last")) {
            oDiv.addClass('thumb-selected-left');
            // find next sibling
            oDiv.next().addClass('thumb-selected-right');
        } else if (oDiv.hasClass("thumb-odd") && !oDiv.hasClass("thumb-first")) {
            oDiv.addClass('thumb-selected-right');
            // find prev sibling
            oDiv.prev().addClass('thumb-selected-left');
        } else {
            oDiv.addClass('thumb-selected');
        }
        //oScrollerPagesList.centerToElement($(oDiv)[0], 0);
        var wid = "container-page-list";
        // refresh is timeouted so centerToElement must be also
        setTimeout(function() {
            tScroller[wid].centerToElement(oDiv[0], 500);        // $(oDiv)[0], 0);
        }, 0);
    } else {
        myDebug("page not found");
    }
    return true;
}

function loadCurrentPage(parutionCode, n, bScroll, bNavigationClose, nAbs) {
    nCurrent = parseInt(n);
    nAbsCurrent = parseInt(nAbs);
    if (parutionCode != pCode) {
        loadCurrentParution(parutionCode);
        _loadCurrentPage();
    } else {
        //parution already active
        _loadCurrentPage();
    }

    //activation du bon supplément
    var oContainer = $(".player-supplements-list-container");
    var oButtons = oContainer.find(".player-supplements-list-item");
    oButtons.find("BUTTON").removeClass("active");
    var oButton = oButtons.filter("[id='" + pCode + "']");
    oButton.find("BUTTON").addClass("active");

    //resize du scroller actif
    syncWrapper();
    syncArticlesListByPage();
}

/*
ne pas faire si chargement du résultat de recherche
ou si chargement de la page
*/


        function left_pad(str, max) {
          str = str.toString();
          return (str.length < max) ? left_pad("0" + str, max) : str;
        }
        function displayPrevNav() {
            return false;
            myDebug("displayPrevNav");
            if (nCurrent == 1) {
                //var prevParution = $('#h3_'+pCode).prevAll('h3').first();
                var prevParution = $('#h3_'+pCode).closest(".supplement").prev(".supplement");
                if (prevParution.length > 0) {
                    $("#prevPage").removeClass('inactiveNav');
                    $("#backPrevPage").removeClass('inactiveBackNav');
                } else {
                    $("#prevPage").addClass('inactiveNav');
                    $("#backPrevPage").addClass('inactiveBackNav');
                }
            } else {
                $("#prevPage").removeClass('inactiveNav');
                $("#backPrevPage").removeClass('inactiveBackNav');
            }
        }
        function displayNextNav() {
            return false;
            myDebug("displayNextNav");
            if ((nCurrent == nMax)||(doublePage&&!(nCurrent % 2)&&((nCurrent+1) == nMax))) {
                //var nextParution = $('#h3_'+pCode+' ~ h3');
                var nextParution = $('#h3_'+pCode).closest(".supplement").next(".supplement");
                if (nextParution.length>0){
                    $("#nextPage").removeClass('inactiveNav');
                    $("#backNextPage").removeClass('inactiveBackNav');
                } else {
                    $("#nextPage").addClass('inactiveNav');
                    $("#backNextPage").addClass('inactiveBackNav');
                }
            } else {
                $("#nextPage").removeClass('inactiveNav');
                $("#backNextPage").removeClass('inactiveBackNav');
            }
        }
        function onFirstZoomLoadHD(e) {        // InitLoadPagesOnFirstZoom() {
            myDebug("onFirstZoomLoadHD");
            var loadHighRes = false;

            if (doublePage) {
                if (nCurrent == 1) {
                    var oPage = $("#wrapper").find(".image-page-right");
                    var oImg = oPage.find(".image-quart-top-left");
                    if (oImg.css("visibility") == "hidden") {
                        loadHighRes = true;
                    }
                } else if (nCurrent == nMax) {
                    var oPage = $("#wrapper").find(".image-page-left");
                    var oImg = oPage.find(".image-quart-top-left");
                    if (oImg.css("visibility") == "hidden") {
                        loadHighRes = true;
                    }
                } else {
                    var oPage = $("#wrapper").find(".image-page-right");
                    var oImg = oPage.find(".image-quart-top-left");
                    if (oImg.css("visibility") == "hidden") {
                        loadHighRes = true;
                    } else {
                        // si mode double page, on teste aussi l'autre page
                        var oPage2 = $("#wrapper").find(".image-page-left");
                        var oImg2 = oPage2.find(".image-quart-top-left");
                        if (oImg2.css("visibility") == "hidden") {
                            loadHighRes = true;
                        }
                    }
                }
            } else {
                if ((nCurrent % 2)) {
                    var oPage = $("#wrapper").find(".image-page-right");
                    var oImg = oPage.find(".image-quart-top-left");
                    if (oImg.css("visibility") == "hidden") {
                        loadHighRes = true;
                    }
                } else {
                    var oPage = $("#wrapper").find(".image-page-left");
                    var oImg = oPage.find(".image-quart-top-left");
                    if (oImg.css("visibility") == "hidden") {
                        loadHighRes = true;
                    }
                }
            }

            if (loadHighRes) {
                if (e.type == "wheel")
                    analyticsEventReaderMouseZoom();
                else
                    analyticsEventReaderTouchZoom();
                myDebug("Load HighRes");
                var bNotDelayed = true;
                // Charger les 4 si non chargées
                if (doublePage) {
                    //myDebug('double page');
                    imageLoadHighDouble(nCurrent, "#wrapper", sThumbDir, "page%03p.jpg", sDomainExpr, sImageDir, "page%03p_%n.jpg", bNotDelayed);
                } else {
                    //myDebug('single page');
                    imageLoadHighSingle(nCurrent, "#wrapper", sThumbDir, "page%03p.jpg", sDomainExpr, sImageDir, "page%03p_%n.jpg", bNotDelayed);
                }
            } else {
                myDebug("HighRes already loaded");
            }
        }


function onClickNext(e) {
    //e.preventdefault();
    if (!e)
      e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
    //alert('next1');
    nextPage();
}

function onClickBackNext(e) {
    //e.preventdefault();
    if (!e)
      e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
    //alert('next2');
    nextPage();
}

function onClickPrev(e) {
    //e.preventdefault();
    if (!e)
      e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
    //alert('prev1');
    prevPage();
}

function onClickBackPrev(e) {
    //e.preventdefault();
    if (!e)
      e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
    //alert('prev2');
    prevPage();
}

/*
                .searchsubnav
                    wrapper
                        scroller
                            .search-result-container
                                .supplement
                                    .supplement-title
                                    .supplement-items id="FIGA_20160728" 
                                        .thumbPage
                                            <IMG code="FIGA_20160728" folio="10">
*/


function loadDefaultPage() {        // called when nCurrent has not been defined
    myDebug("loadDefaultPage");
    nCurrent = 1;
    nAbsCurrent = 1;
    // il faut déterminer si le chemin de fer ou le résultat de recherche est à considérer
    
    
    // utiliser les npuvelles fonctions
    
    var oRoot = $(".liseuse-panel-block12");
    myDebug(oRoot);
    var oWrappers = oRoot.find(".result-wrapper-container");
    myDebug(oWrappers);
    var oActiveWrapper = oWrappers.filter(".active");
    myDebug(oActiveWrapper);
    if (oActiveWrapper.length > 0) {
    } else {
        myDebug("no wrapper active");
        oActiveWrapper = oWrappers.first();
        oActiveWrapper.addClass("active");
        myDebug(oActiveWrapper);
        setTimeout(function() { oScrollerPagesList.refresh(); }, 0);
    }
    var id = oActiveWrapper.attr("id");
    if (id == "container-page-list") {
    } else if (id == "container-search-results") {
    } else {
    }
    // déterminer ensuite quel supplément est à considérer
    var oSupplements = oActiveWrapper.find(".supplement-items");
    myDebug(oSupplements);
    var oSupplement = oSupplements.filter(".active");
    myDebug(oSupplement);
    if (oSupplement.length > 0) {
    } else {
        myDebug("no supplement active");
        oSupplement = oSupplements.first();
        oSupplement.addClass("active");
        myDebug(oSupplement);
    }
    var code = oSupplement.attr("id");
    /* pas bon car on ne synchronise pas tous les éléments avec cette méthode
    loadCurrentParution(code);
    _loadCurrentPage();*/
    loadCurrentPage(code, 1, true, false, 1);        // loadCurrentPage(parutionCode, n, bScroll, bNavigationClose)
}

function getActiveWrapper() {
    myDebug("getActiveWrapper");
    var oRoot = $(".liseuse-panel-block12");
    //myDebug(oRoot);
    var oWrappers = oRoot.find(".result-wrapper-container");
    var oActiveWrapper = oWrappers.filter(".active");
    //myDebug(oActiveWrapper);
    if (oActiveWrapper.length > 0) {
        return oActiveWrapper;
    } else {
    }
    return null;
}

function getWrapperID(oActiveWrapper) {
    return oActiveWrapper.attr("id");
}

function getActiveSupplement(oActiveWrapper) {
    myDebug("getActiveSupplement");
    var oSupplements = oActiveWrapper.find(".supplement-items");
    //myDebug(oSupplements);
    var oSupplement = oSupplements.filter(".active");
    //myDebug(oSupplement);
    if (oSupplement.length > 0) {
        return oSupplement;
    } else {
    }
    return null;
}

function activateSupplement(oNewSupplement, oPrevSupplement, wid) {
    myDebug("activateSupplement");
    if (oPrevSupplement != null) {
        oPrevSupplement.removeClass("active");
    } else {
    }
    if (oNewSupplement != null) {                // search results may not have every supplement
        oNewSupplement.addClass("active");
    } else {
    }
    refreshScroller(wid);
}

function getNextSupplement(oActiveSupplement) {
    myDebug("getNextSupplement");
    var oNextSupplement = oActiveSupplement.next(".supplement-items");
    //myDebug(oNextSupplement);
    if (oNextSupplement.length > 0) {
        return oNextSupplement;
    } else {
    }
    return null;
}

function getPrevSupplement(oActiveSupplement) {
    myDebug("getPrevSupplement");
    var oPrevSupplement = oActiveSupplement.prev(".supplement-items");
    //myDebug(oPrevSupplement);
    if (oPrevSupplement.length > 0) {
        return oPrevSupplement;
    } else {
    }
    return null;
}

function getSupplementID(oSupplement) {
    var sid = oSupplement.attr("id");
    return sid;
}

function getSupplementFromID(oWrapper, quadri) {
    myDebug("getSupplementFromID");
    var oSupplements = oWrapper.find(".supplement-items");
    //myDebug(oSupplements);
    var oSupplement = oSupplements.filter("[id='" + quadri + "']");
    //myDebug(oSupplement);
    if (oSupplement.length > 0) {
        return oSupplement;
    } else {
    }
    return null;
}

function getFirstSupplement(oWrapper) {
    myDebug("getFirstSupplement");
    var oSupplements = oWrapper.find(".supplement-items");
    //myDebug(oSupplements);
    if (oSupplements.length > 0) {
        oSupplement = oSupplements.first();
        return oSupplement;
    } else {
    }
    return null;
}

function getURID(nPage) {
	// full text search may be active
	// get active supplement ID
	var oActiveWrapper = getActiveWrapper();
    var wid = getWrapperID(oActiveWrapper);
	// sinon pCode devrait contenir le code du supplément actif
	var oActiveSupplement = getActiveSupplement(oActiveWrapper);
	if (oActiveSupplement ==  null) {
		oActiveSupplement = getFirstSupplement(oActiveWrapper);
	}
	if (oActiveSupplement ==  null) {
		return null;
	}
    var quadri = oActiveSupplement.attr("id");
	// if not use the one that have all the pages
	if (wid != "container-page-list") {
		var oRoot = $(".liseuse-panel-block12");
		wid = "container-page-list";
		oActiveWrapper = oRoot.find("#" + wid);
		oActiveSupplement = getSupplementFromID(oActiveWrapper, quadri);
	}
    var oP = getPage(nPage, oActiveSupplement);
    var urid = oP.attr("urid");
	return urid;
}

function refreshScroller(wid) {
    myDebug("refreshScroller " + wid);
    if (wid == "container-page-list") {
        setTimeout(function() { oScrollerPagesList.refresh(); oScrollerPagesList.scrollTo(0, 0, 200); }, 0);
    } else if (wid == "container-search-results") {
        setTimeout(function() { oScrollerSearchResults.refresh(); oScrollerSearchResults.scrollTo(0, 0, 200); }, 0);
    }
}

function getFirstPage(oSupplement) {
    myDebug("getFirstPage");
    var oPage = oSupplement.find(".thumbPage").first();
    myDebug(oPage);
    if (oPage.length > 0) {
        return oPage;
    }
    return null;
}

function getLastPage(oSupplement) {
    myDebug("getLastPage");
    var oPage = oSupplement.find(".thumbPage").last();
    if (oPage.length > 0) {
        return oPage;
    }
    return null;
}

function getPage(nCurrent, oSupplement) {
    var oPage = oSupplement.find(".thumbPage[folio='" + nCurrent + "']");
    if (oPage.length > 0) {
        return oPage;
    }
    return null;
}

function getNextPage(oPage) {
    var oNextPage;
    if (doublePage) {
        if (oPage.hasClass("thumb-odd-single")) {
            oNextPage = oPage.next(".result-item");
        } else if (oPage.hasClass("thumb-even-single")) {
            oNextPage = oPage.next(".result-item");
        } else {
            oNextPage = oPage.next(".result-item");
            if (oNextPage.hasClass("thumb-odd-single")) {
            } else if (oNextPage.hasClass("thumb-even-single")) {
            } else if (oNextPage.hasClass("thumb-last")) {
            } else {
                oNextPage = oNextPage.next(".result-item");
            }
        }
    } else {
        oNextPage = oPage.next(".result-item");        // specify selector as we may encounter a DIV clear:both
    }
    if (oNextPage.length > 0) {
        //myDebug(oNextPage);
        return oNextPage;
    } else {
    }
    myDebug(null);
    return null;
}

function getPrevPage(oPage) {
    myDebug("getPrevPage");
    var oPrevPage;
    if (doublePage) {
        if (oPage.hasClass("thumb-odd-single")) {
            oPrevPage = oPage.prev(".result-item");
        } else if (oPage.hasClass("thumb-even-single")) {
            oPrevPage = oPage.prev(".result-item");
        } else {
            oPrevPage = oPage.prev(".result-item");
            if (oPrevPage.hasClass("thumb-odd-single")) {
            } else if (oPrevPage.hasClass("thumb-even-single")) {
            } else if (oPrevPage.hasClass("thumb-first")) {
            } else {
                oPrevPage = oPrevPage.prev(".result-item");
            }
        }
    } else {
        oPrevPage = oPage.prev(".result-item");
    }
    //myDebug(oPrevPage);
    if (oPrevPage.length > 0) {
        //myDebug(oPrevPage);
        return oPrevPage;
    } else {
    }
    myDebug(null);
    return null;
}

function getPageFolio(oPage) {
    myDebug("getPageFolio");
    var folio = oPage.attr("folio");
    myDebug(folio);
    return folio;
}
function getPageAbsFolio(oPage) {
    myDebug("getPageAbsFolio");
    var folio = oPage.attr("absFolio");
    myDebug(folio);
    return folio;
}

function gotoPage(nPage) {        // assume nPage is absolute folio, single supplement, otherwise we could use container-page-list then search absfolio then get relative folio and supplement code
    myDebug("gotoPage");
    myDebug(nPage);
    var oRoot = $(".liseuse-panel-block12");
    var wid = "container-page-list";
    var oWrapper = oRoot.find("#" + wid);            // .result-wrapper-container
    var oItems = oWrapper.find(".supplement-items");
    var oSupplement = oItems.first();
    var sCode = oSupplement.attr("id");
    loadCurrentPage(sCode, nPage, true, true, nPage);
}

function nextPage() {
    if (nCurrent == null) {                // si on ne charge pas par défaut la première page du premier supplément
        loadDefaultPage();
    } else {
        // si double et impair => min(+2,nMax) sinon +1
        // on reste sur les pages impairs en double
        var oActiveWrapper = getActiveWrapper();
        var oActiveSupplement = getActiveSupplement(oActiveWrapper);
        // ici il ne faut pas forcément utiliser nCurrent si on a un changement de supplément
        var code = getSupplementID(oActiveSupplement);        // le supplément peut avoir été activé (on vient de basculer vers le résultat de recherche qui ne contient pas le même supplément) sans qu'aucune page de ce supplément n'est encore été chargée et donc pCode n'est pas en phase
        var oNextPage;
        if (code == pCode) {
            var oPage = getPage(nCurrent, oActiveSupplement);
            if (oPage == null) {                // on vient de basculer vers le résultat de recherche qui ne contient pas cette même page et on clique sur NextPage
                oNextPage = getFirstPage(oActiveSupplement);
            } else {
                oNextPage = getNextPage(oPage);
            }
        } else {
            oNextPage = getFirstPage(oActiveSupplement);
        }
        if (oNextPage != null) {
            var nNext = getPageFolio(oNextPage);
            var nAbsFolio = getPageAbsFolio(oNextPage);
            loadCurrentPage(code, nNext, true, false, nAbsFolio);        // pCode, nNext, true, false);
        } else {        // essayons si il y a un supplément qui suit
            var oNextSupplement = getNextSupplement(oActiveSupplement);
            if (oNextSupplement != null) {
                var wid = getWrapperID(oActiveWrapper);
                activateSupplement(oNextSupplement, oActiveSupplement, wid);
                // quelle est la première page ?
                var oNextPage = getFirstPage(oNextSupplement);
                if (oNextPage != null) {
                    var nNext = getPageFolio(oNextPage); var nAbsFolio = getPageAbsFolio(oNextPage);
                    var code = getSupplementID(oNextSupplement);
                    loadCurrentPage(code, nNext, true, false, nAbsFolio);
                }
            }
        }
    }
}

function prevPage() {
    myDebug("prevPage");
    myDebug(nCurrent);
    if (nCurrent == null) {                // si on ne charge pas par défaut la première page du premier supplément
        loadDefaultPage();
    /*} else if (nCurrent == 1) {
        var oActiveWrapper = getActiveWrapper();
        var oActiveSupplement = getActiveSupplement(oActiveWrapper);
        var oPrevSupplement = getPrevSupplement(oActiveSupplement);
        if (oPrevSupplement != null) {
            var wid = getWrapperID(oActiveWrapper);
            activateSupplement(oPrevSupplement, oActiveSupplement, wid);
            var oPage = getLastPage(oPrevSupplement);
            if (oPage != null) {
                var code = getSupplementID(oPrevSupplement);
                var nPrev = getPageFolio(oPage);
                loadCurrentPage(code, nPrev, true, false);        // loadCurrentPage(parutionCode, n, bScroll, bNavigationClose)
            } else {
            }
        } else {        // on a atteint la première page du premier supplément
        }*/
    } else {
        var oActiveWrapper = getActiveWrapper();
        var oActiveSupplement = getActiveSupplement(oActiveWrapper);
        // ici il ne faut pas forcément utiliser nCurrent si on a un changement de supplément
        var code = getSupplementID(oActiveSupplement);        // le supplément peut avoir été activé (on vient de basculer vers le résultat de recherche qui ne contient pas le même supplément) sans qu'aucune page de ce supplément n'est encore été chargée et donc pCode n'est pas en phase
        var oPrevPage;
        if (code == pCode) {
            var oPage = getPage(nCurrent, oActiveSupplement);
            /**/if (oPage == null) {                // on vient de basculer vers le résultat de recherche qui ne contient pas cette même page et on clique sur PrevPage
                oPrevPage = getFirstPage(oActiveSupplement);
            } else {/**/
                oPrevPage = getPrevPage(oPage);
            /**/}/**/
        } else {
            oPrevPage = getFirstPage(oActiveSupplement);
        }
        if (oPrevPage != null) {
            var nPrev = getPageFolio(oPrevPage); var nAbsFolio = getPageAbsFolio(oPrevPage);
            loadCurrentPage(code, nPrev, true, false, nAbsFolio);        // pCode, nNext, true, false);
            //loadCurrentPage(pCode, nPrev, true, false);
        } else {        // essayons si il y a un supplément qui suit
            var oPrevSupplement = getPrevSupplement(oActiveSupplement);
            if (oPrevSupplement != null) {
                var wid = getWrapperID(oActiveWrapper);
                activateSupplement(oPrevSupplement, oActiveSupplement, wid);
                // quelle est la dernière page ?
                var oPrevPage = getLastPage(oPrevSupplement);
                if (oPrevPage != null) {
                    var nPrev = getPageFolio(oPrevPage); var nAbsFolio = getPageAbsFolio(oPrevPage);
                    var code = getSupplementID(oPrevSupplement);
                    loadCurrentPage(code, nPrev, true, false, nAbsFolio);
                } else {
                }
            } else {        // on a atteint la dernière page du dernier supplément
            }
        }
        // si double et impair => -2 sinon -1
        // on reste sur les pages impairs en double
        /*var nPrev = (doublePage && (nCurrent % 2)) ? (nCurrent - 2) : (nCurrent - 1);
        loadCurrentPage(pCode, nPrev, true, false);*/
    }
}






        function navigationClose(n) {
            myDebug("================================= navigationClose ==============================================");
            //alert("navigationClose=" + n);
            closeTopBar();
            //toggleTopBar();
            return;
            $("#searchsubnav").show({
            });
            $("#menuBox").hide({
            });
            closeTopBar();
            /*
            $("#menuBox").animate({
                left:-($("#menuBox").width()+10)
            });*/
        }
        function navigationOpen() {
            return;
            $("#menuBox").show({
            });
            $("#searchsubnav").hide({
            });

            /*$("#accordionNav").accordion("refresh");*/
            /*
            $("#menuBox").animate({
                left:0
            });*/
        }
        /*function searchClose() {
            $(".searchnav").hide({
            });
        }
        function searchOpen() {
            $(".searchnav").show({
            });
        }*/
        /*function searchToggle() {
            var oSearch = $(".searchsubnav");
            var oNav = $(".nav");
            if (oSearch.hasClass("nav-invisible")) {
                oSearch.removeClass("nav-invisible");
                oNav.addClass("nav-invisible");
                var oTab = $(".panel-tab-searchresult");
                oTab.addClass("panel-tab-active");
                var oTab = $(".panel-tab-cdf");
                oTab.removeClass("panel-tab-active");
            } else {
                oNav.removeClass("nav-invisible");
                oSearch.addClass("nav-invisible");
                var oTab = $(".panel-tab-cdf");
                oTab.addClass("panel-tab-active");
                var oTab = $(".panel-tab-searchresult");
                oTab.removeClass("panel-tab-active");
            }
        }*/
        
        
        // obsolete, voir         $("#display-search-results").change(function () {

        /*function searchShow() {
            myDebug('--- searchShow show search result against CDF');
            var oSearch = $(".searchsubnav");
            var oNav = $(".nav");
            oSearch.removeClass("nav-invisible");
            oNav.addClass("nav-invisible");
            var oTab = $(".panel-tab-search-result");
            oTab.addClass("panel-tab-active");
            var oTab = $(".panel-tab-cdf");
            oTab.removeClass("panel-tab-active");
        }
        // obsolete, voir         $("#display-search-results").change(function () {
        function searchHide() {
            var oSearch = $(".searchsubnav");
            var oNav = $(".nav");
            oNav.removeClass("nav-invisible");
            oSearch.addClass("nav-invisible");
            var oTab = $(".panel-tab-cdf");
            oTab.addClass("panel-tab-active");
            var oTab = $(".panel-tab-search-result");
            oTab.removeClass("panel-tab-active");
        }*/
        function SetDisplayHeight() {
            myDebug("SetDisplayHeight 2");
            //$(".subnav").css("height",$('body').height()-$('.nav_back').height()-1 + "px");
            //$(".searchsubnav").css("height", ($('body').height() - $('.searchnav_back').height() - $("#backToResult").height()) + "px"); //-10 pour le padding de .searchnav_back
        }