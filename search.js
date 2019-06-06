
function fulltextSearch() {
    var o = $('#kiosque-search-fulltext');
    var sTerm = o.val();
    analyticsEventReaderPanelSearch(pCode, parutionDate, sTerm);
    SearchPages(sTerm);
}
        /*
{"resultSet":[
{"file":"page001","hl":"<zone t='126' l='70' w='41' h='12' \/><zone t='126' l='70' w='41' h='12' \/><zone t='150' l='263' w='18' h='7' \/>","code":"FECO_20160715"},
{"file":"page002","hl":"<zone t='130' l='63' w='36' h='13' \/><zone t='244' l='535' w='19' h='7' \/><zone t='287' l='479' w='18' h='7' \/><zone t='353' l='154' w='17' h='7' \/><zone t='385' l='484' w='19' h='7' \/><zone t='416' l='50' w='18' h='7' \/><zone t='515' l='119' w='12' h='7' \/><zone t='595' l='72' w='19' h='7' \/><zone t='626' l='64' w='19' h='7' \/>","code":"FECO_20160715"},
{"file":"page003","hl":"<zone t='773' l='261' w='19' h='7' \/>","code":"FECO_20160715"},
{"file":"page004","hl":"<zone t='595' l='394' w='21' h='7' \/>","code":"FECO_20160715"},

{"file":"page004","hl":"<zone t='342' l='399' w='19' h='7' \/>","code":"FIGA_20160715"},
{"file":"page005","hl":"<zone t='472' l='349' w='19' h='7' \/>","code":"FIGA_20160715"},
{"file":"page014","hl":"<zone t='318' l='169' w='19' h='7' \/>","code":"FIGA_20160715"},
{"file":"page016","hl":"<zone t='644' l='139' w='19' h='7' \/><zone t='751' l='50' w='19' h='7' \/>","code":"FIGA_20160715"},
{"file":"page023","hl":"<zone t='164' l='247' w='18' h='7' \/>","code":"FIGA_20160715"}
],"resultLabel":null,"nbResult":9}
*/
function resetSearchCount() {
    myDebug('resetSearchCount');
    $("#search-results-count").html("");
}
function setSearchCount(data) {
    myDebug('setSearchCount');
    var n = data.sResult;
    //$(".panel-tab-search-result").html("Résultat de recherche (" + n + ")");
    $("#search-results-count").html(n);
}

function clearSearchPanelThumbnails() {
    myDebug("clearSearchPanelThumbnails");
    var oPanel = $("#container-search-results");
    var oScroller = oPanel.find(".result-scroller");
    var oResultItems = oScroller.find(".result-items");
    oResultItems.html('<div class="placeholder"></div><div style="clear: both"></div>');
}
function setSearchPanelThumbnails(data) { //, firstPageCode, firstPageFolio) {
    myDebug("setSearchThumbnails");
    result = data.html;
    //myDebug(result);
    var oPanel = $("#container-search-results");
    var oScroller = oPanel.find(".result-scroller");
    var oResultItems = oScroller.find(".result-items");
    oResultItems.html(result);

    var oThumbs = oResultItems.find(".thumbPage IMG");
    oThumbs.mousedown(function(event) {    // CLICK-DISCARD
        myDebug("mousedown");
        var $this = $(this);
        var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
        xThumb = oOffset.left;
        myDebug(xThumb);
        yThumb = oOffset.top;
        myDebug(yThumb);
    });
    oThumbs.click(function(event) {        // CLICK-DISCARD        // mouseup(function(event) {
        //alert('search-thumbs-click');
        myDebug("click");
        myDebug(xThumb);
        myDebug(yThumb);
        var $this = $(this);
        var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
        x = oOffset.left;
        y = oOffset.top;
        myDebug(x);
        myDebug(y);
        if (xThumb == -1) {                    // click généré par iScroll
            var oSupplement = $this.closest(".supplement-items");
            var sCode = oSupplement.attr("id");
            var oThumb = $this.closest(".thumbPage");
            var nFolio = getPageFolio(oThumb); var nAbsFolio = getPageAbsFolio(oThumb);        // oThumb.attr("folio");
            analyticsEventReaderPanelSearchResult();
            loadCurrentPage(sCode, nFolio, true, true, nAbsFolio);
            // if small screen automatically close the panel
            console.log($(window).width());
            //if ($(window).width() < 1024) {
                upPanel.close();
            //}
            //alert("click filtered touch");
            xThumb = 0;
        //} else if (x == xThumb && y == yThumb) {        // vrai click
        } else if (Math.abs(x - xThumb) < 1 && Math.abs(y - yThumb) < 1) {        // vrai click
            var oSupplement = $this.closest(".supplement-items");
            var sCode = oSupplement.attr("id");
            var oThumb = $this.closest(".thumbPage");
            var nFolio = getPageFolio(oThumb); var nAbsFolio = getPageAbsFolio(oThumb);        // oThumb.attr("folio");
            analyticsEventReaderPanelSearchResult();
            loadCurrentPage(sCode, nFolio, true, true, nAbsFolio);
            // if small screen automatically close the panel
            console.log($(window).width());
            //if ($(window).width() < 1024) {
                upPanel.close();
            //}
            //alert("click filtered mouse");
        } else {
            myDebug("click discarded");
        }
    });
}
            // for ipad only
            /*$("#searchsubnav .thumbPage IMG").click(function(event) {
                console.log(event);
                    var $this = $(this);
                    var sCode = $this.attr("code");
                    var sFolio = $this.attr("folio");
                    loadCurrentPage(sCode, sFolio, true, true);
                    alert("click99");
            });*/
            /*$("#searchsubnav DIV.supplement DIV.supplement-title").click(function () {
                var $this = $(this);
                var oSupplement = $this.closest(".supplement");
                var oThumbs = oSupplement.find(".supplement-items");

                if (!oSupplement.hasClass("supplement-closed")) {
                    oSupplement.addClass("supplement-closed");
                } else {
                    oSupplement.removeClass("supplement-closed");
                }
                myDebug("iScroll Supplement open/close");
                myDebug(this);
                //myMenuScrollSearch.refresh();        // recalcule le scroll width
            });*/
        /*
            var folio = 0;
            var result = '';
            var prevFolio = -1;
            var n = 0;
            var nMax = data.resultSet.length;
            for (var i = 0; i < nMax; i++) {
                folio = parseInt(ltrim(data.resultSet[i].file.substring(4,7),"0"));
                //alert(folio);
                if (i == 0) {
                    firstPageCode = data.resultSet[i].code;
                    firstPageFolio = folio;
                }
                //var oddFolioClass = ((folio % 2) == 0) ? 'searchFolioLeft' : 'searchFolioRight';
                var sEven;
                if ((folio % 2) == 0) {                // une page paire est à gauche et on a besoin de savoir si il y aura une page impaire à sa droite
                    if (!haveRightFolio(data, i, nMax, folio)) {
                        sEven = " thumb-even-single";
                    } else {
                        sEven = " thumb-even";
                    }
                } else {                            // une page impaire est à droite
                    if (prevFolio + 1 == folio) {
                        sEven = " thumb-odd";
                    } else {                        // add separator
                        sEven = " thumb-odd-single";
                    }
                }
                prevFolio = folio;
                if (!n) sEven += " thumb-first";
                ++n;
                if (n == nMax) sEven += " thumb-last";
                var oResult = data.resultSet[i];
                myDebug(oResult.code);
                var sH3 = "#h3_"+oResult.code;                    // #h3_PQLC_20140108
                myDebug(sH3);
                var oH3 = $(sH3);
                var sRepository = oH3.attr('repository');
                myDebug(sRepository);
                var sSrc = rbaseUrl+sRepository+'/'+sThSubFolder+'/'+oResult.file+'.jpg';
                myDebug(sSrc);
                var sID = 'img_search_'+oResult.code+'_'+oResult.file;
                myDebug(sID);
                // do not use onclick anymore
                //var sOnclick = 'loadCurrentPage(\''+oResult.code+'\',\''+folio+'\',true, true);';
                //myDebug(sOnclick);
                // '" onClick="'+sOnclick+
                //  '+oddFolioClass+'
                result += '<div class="thumbPage' + sEven + ' thumb-snap">\
                <img class="" id="'+sID+'" src="'+sSrc+'" zones="'+oResult.hl+'" code="'+oResult.code+'" folio="'+folio+'"/>\
                <div class="folio">'+folio+'</div>\
                </div>';
            }
        */
// nécessaire si ce sont les visuels qui donne la largeur ce qui n'est plus le cas avec le figaro
function ooorefreshScrollerWhenEverythingIsLoaded() { //firstPageCode, firstPageFolio) {
    //alert('refreshScrollerWhenEverythingIsLoaded-thumbs-click');
    myDebug("refreshScrollerWhenEverythingIsLoaded");
    // this cannot be done because thumbnails are loaded asynchronously and we don't have set image width
    var oSearchResultContainer = $("#container-search-results");        // .search-result-container");
    var t = oSearchResultContainer.find('IMG');
    if (t.length) {
        myDebug(t.length + ' images found');
        t.load(function() {
            // take care that this function is going to be executed several times
            myDebug("loaded");
            myDebug(this);
            $(this).addClass("search-image-loaded");
            var bLoaded = true;
            t.each(function(index) {
                if (!$(this).hasClass("search-image-loaded")) {
                    bLoaded = false;
                    return false;        // break;
                }
                return true;
            });
            if (bLoaded) {
                myDebug("all images are loaded");
                // do the job
                myDebug("Search result iScroll new content 1");
                //myMenuScrollSearch.refresh();            // should be done inevitably when scroller has been filled
                /*if (firstPageCode != '') {
                    myDebug("doublePage 1=" + doublePage);
                    loadCurrentPage(firstPageCode, firstPageFolio, true, false);
                    myDebug("doublePage 2=" + doublePage);
                }*/
                //modeDoublePage();
            } else {
                myDebug("all images are not loaded");
            }
        });
    } else {
        console.log('no image found');
        // pas d'image donc pas de résultat à la recherche
        myDebug("Search result iScroll new content 2");
        //myMenuScrollSearch.refresh();            // should be done inevitably when scroller has been filled
    }
}
function chgFulltext() {
    highlightsRemove();
}
function SearchPages(term) {
    //alert('refreshScrollerWhenEverythingIsLoaded-thumbs-click');
    myDebug("SearchPages");
    if (isBlank(term)) {
        myDebug("No keyword");
        resetSearchCount();
        highlightsRemove();
        HighLightsdata = null;
        $("#display-search-results").prop("checked", false);
        clearSearchPanelThumbnails();
        var wid;
        wid = "container-page-list";
        var oActiveWrapper = activateWrapper(wid);
        return;
    }
    myDebug("Keyword=" + term);
    clearSearchPanelThumbnails();
    var oContainer = $("#container-search-results");
    var oItems = oContainer.find(".result-items");
    var oPlaceholder = oItems.find(".placeholder");
    insertWait(oPlaceholder);
    //$(".search-result-container").html('<img src="css/icons/wait.gif"/>');
    $.ajax({
        type: "POST",
        url: "ajax/ajax-search-player.php",
        data: 'q=' + parutionCode + '&d=' + parutionDate + '&term=' + term,
        success: function(data){
            removeWait(oPlaceholder);
            data = jQuery.parseJSON(data);
            console.log(data);
            var sError = data.error;
            if (sError == "sessionTimeout") {
                printSessionTimeout();
            } else if (sError != null) {
                printAppErrorMessage(sError);
            } else {
                HighLightsdata = data;
                //result += '"'+term+'"<br/>';
                //if (data.resultLabel != null) result += '<div class="search-result-label">' + data.resultLabel + '</div>';        // <br/>';
                setSearchCount(data);
                //result += '<br/>';
                /*var firstPageCode = '';
                var firstPageFolio = 0;
                var oFolio = new Object();
                getFirstResultFolio(data, oFolio);        // firstPageCode, firstPageFolio);
                firstPageCode = oFolio.firstPageCode;
                firstPageFolio = oFolio.firstPageFolio;*/
                setSearchPanelThumbnails(data);        // , firstPageCode, firstPageFolio);    // use data.html to fill container
                //searchShow();
                $("#display-search-results").prop("checked", true);            // does not trigger onchange() event
                // display search result container and load first page
                var wid;
                wid = "container-search-results";
                var oActiveWrapper = activateWrapper(wid);
                //var oActiveWrapper = getActiveWrapper();
                oFirstSupplement = getFirstSupplement(oActiveWrapper);
                                        if (oFirstSupplement != null) {
                                                var code = getSupplementID(oFirstSupplement);
                                                activateSupplement(oFirstSupplement, null, wid);
                                                var oFirstPage = getFirstPage(oFirstSupplement);
                                                if (oFirstPage != null) {
                                                        var nFirst = getPageFolio(oFirstPage); var nAbsFolio = getPageAbsFolio(oFirstPage);
                                                        var code = getSupplementID(oFirstSupplement);
                                                        SwitchDisplayFromSize(false, true, false);
                                                        loadCurrentPage(code, nFirst, true, false, nAbsFolio);
                                                        // on page load with search term we now have page size
                                                } else {
                                                }
                }

                //refreshScrollerWhenEverythingIsLoaded();//firstPageCode, firstPageFolio);
            }
        },
        error: function(data, transport) {
            removeWait(oPlaceholder);
            printSysErrorMessage(data, transport, oPlaceholder);
            //$("#contentList").html('<div class="root">Erreur de chargement.<!--Err:'+print_r(data)+'-T:'+transport+'//--></div>');
        }
    });
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
function ltrim (str, charlist) {
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '').replace(re, '');
}
function gotoMainPage(url, params) {
    myDebug("url=" + url);            // ../index.php
    myDebug("params=" + params);        // NOBS
    if (params != '') {
        url = url + "#x" + params;        // "?toto=1&redirect=" + params + "&tutu=2";
    }
    document.location = url;
}
$(document).ready(function(){
/*
    $("#searchField").keypress(function(event) {
        // Enter
        if(event.which == 13) {
            SearchPages($(this).val());
            return true;
        }
    });
*/
});
