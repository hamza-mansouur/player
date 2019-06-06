//-------------------------------------------------------------------------------------------------------------------------------------------
    var bHighlightBlink = false;

    var idBlinkTimer;

    var nBlinkInvisibleDelay = 500;
    var nBlinkVisibleDelay = 5000;

    function highlightStartBlink() {
        bHighlightBlink = true;
        idBlinkTimer = window.setInterval("highlight1()",nBlinkVisibleDelay);
    }

    function highlightStopBlink() {
        clearInterval(idBlinkTimer);
        bHighlightBlink = false;
    }

    function highlightBlink() {
        if (bHighlightBlink) {
            clearInterval(idBlinkTimer);
            bHighlightBlink = false;
        } else {
            idBlinkTimer = window.setInterval("highlight1()",nBlinkVisibleDelay);
            bHighlightBlink = true;
        }
    }

    function highlight1(){
        console.log("highlight1");
        $(".highlight").css("background-color", "transparent");
        clearInterval(idBlinkTimer);
        idBlinkTimer = window.setInterval("highlight2()",nBlinkInvisibleDelay);
    }

    function highlight2(){
        console.log("highlight2");
        $(".highlight").css("background-color", cHighlight);
        clearInterval(idBlinkTimer);
        idBlinkTimer = window.setInterval("highlight1()",nBlinkVisibleDelay);
    }

//-------------------------------------------------------------------------------------------------------------------------------------------
    function highlightOn() {
        if ($(".highlight").css("display") == "block")
            $(".highlight").css("display", "none");
        else
            $(".highlight").css("display", "block");
    }

    function highlightsShow() {
        $(".highlight").css("display", "block");
    }

    function highlightsHide() {
        $(".highlight").css("display", "none");
    }
    
//-------------------------------------------------------------------------------------------------------------------------------------------
    var idHighlightFlash;
    var nFlashDelay = 200;
    var nFlash;

    function highlightFlash() {
        idHighlightFlash = window.setInterval("highlightFlash1()",nFlashDelay);
        nFlash = 2;
    }

    function highlightFlash1(){
        $(".highlight").css("background-color", "transparent");
        clearInterval(idHighlightFlash);
        idHighlightFlash = window.setInterval("highlightFlash2()",nFlashDelay);
    }

    function highlightFlash2(){
        $(".highlight").css("background-color", cHighlight);
        clearInterval(idHighlightFlash);
        nFlash = nFlash - 1;
        if (nFlash) {
            idHighlightFlash = window.setInterval("highlightFlash1()",nFlashDelay);
        }
    }

//-------------------------------------------------------------------------------------------------------------------------------------------

var highlightID = 0;
var cHighlight = "red";

//-------------------------------------------------------------------------------------------------------------------------------------------
function highlightAdd(o, x, y, w, h, bRightPage) {
    var id = "highlight"+highlightID;
    ++highlightID;
    console.log(id);
    var oRoot = $( "#highlightRoot" );
    if (oRoot.length == 0) myDebug("ROOT NOT FOUND FOR HIGHLIGHT DIVS");

    //var nRatio = 1754=hauteur en pixel de la page / 907.1=hauteur en mm;
    var nRatio = singlePageWidth / mmPageWidth;
//console.log('singlePageWidth'+singlePageWidth);
//console.log('mmPageWidth'+mmPageWidth);
    //nRatio = nRatio / 1.18;

    // transformer des mm en px
    h = h * nRatio;
    w = w * nRatio;

    h = mround(h);
    w = mround(w);

    x = x * nRatio;
    y = y * nRatio;

    if (bRightPage) x = x + singlePageWidth;

/* Décallage sur version PC
 * Version MOBILE UNIQUEMENT // 21/06/2016
        // décallage de la barre de navigation de gauche
        if ($("#prevPage").length>0) {
            x = x + $("#prevPage").width();
        }
*/
    x = mround(x);
    y = mround(y);

    oRoot.after('<div id="'+id+'" class="highlight" style="top:'+y+'px; left:'+x+'px; z-index: 1000; position: absolute; height:'+h+'px; width:'+w+'px; background-color:'+cHighlight+';"></div>');
/*
    var dh = 20;
    var dw = 26;

    oRoot.after('<div id="'+id+'-top" class="highlight highlight-top" style="top:'+(y-dh-4)+'px; left:'+(x-dw-4)+'px; z-index: 1000; position: absolute; height:'+dh+'px; width:'+(4+dw+w+dw+4)+'px; background-color:'+cHighlight+';"></div>');
    oRoot.after('<div id="'+id+'-left" class="highlight" style="top:'+(y-4)+'px; left:'+(x-dw-4)+'px; z-index: 1000; position: absolute; height:'+(4+h+4)+'px; width:'+dw+'px; background-color:'+cHighlight+';"></div>');
    oRoot.after('<div id="'+id+'-right" class="highlight" style="top:'+(y-4)+'px; left:'+(x+w+4)+'px; z-index: 1000; position: absolute; height:'+(4+h+4)+'px; width:'+dw+'px; background-color:'+cHighlight+';"></div>');
    oRoot.after('<div id="'+id+'-bottom" class="highlight highlight-bottom" style="top:'+(y+h+4)+'px; left:'+(x-dw-4)+'px; z-index: 1000; position: absolute; height:'+dh+'px; width:'+(4+dw+w+dw+4)+'px; background-color:'+cHighlight+';"></div>');
*/        
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function highlightsRemove() {
    $(".highlight").remove();
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function highlightsAdd(tRectangles, bRightPage) {        // oRoot, bRightPage) {
    console.log("highlightsAdd");
    /*
        tRectangles:Array[3]
        0:Object
            h:7
            left:459
            top:122
            w:18
    */
    //console.log(oRoot);
    console.log(tRectangles);
    var nMax = tRectangles.length;
    var n = 0;
    for(; n < nMax; ++n) {
        var oRectangle = tRectangles[n];
    //$.each(oRoot.childNodes, function() {
        //console.log(this);
        var nTop, nLeft, nWidth, nHeight;
        nTop = oRectangle["t"];//this.getAttribute("t");
        nLeft = oRectangle["l"];//this.getAttribute("l");
        nWidth = oRectangle["w"];//this.getAttribute("w");
        nHeight = oRectangle["h"];//this.getAttribute("h");
        var oNote = highlightAdd(null, nLeft, nTop, nWidth, nHeight, bRightPage);
        //console.log(nTop);
    }
    //});
}

//-------------------------------------------------------------------------------------------------------------------------------------------
function kloadHighlight(myData) {
    myDebug("kloadHighlight");
    //myDebug(myData);
    if (myData == null) {
        myDebug("no highlight data");
        return;
    }
    var oSuperset = myData.highlight;    // resultSet;
    //myDebug(oSuperset);
    /*
    Object
        FECO:Object
            11:Object
                nPage:11
                tRectangles:Array[3]
                    0:Object
                        h:7
                        left:459
                        top:122
                        w:18
    */
    //if (!oSuperset.length) return true;
    myDebug(pCode);
    var oSet = oSuperset[pCode];                // avant OUFR_20160728, maintenant FIGA
    if (oSet == null) {
        myDebug("no highlight data found for {" + pCode + "}");
        return true;
    }
    //var nMax = oSet.length;                        // impossible car on a un objet
    //myDebug(oSet);
    //console.log(nMax);
    //console.log(oSet[0]);
    //var n;
    //for(n = 0; n < nMax; ++n) {
    myDebug(nPageLeft);
    myDebug(nPageRight);
    for(var k in oSet) {
        myDebug("nPage=" + k);
        oItem = oSet[k];
        //console.log("n=" + n);
        //var oItem = oSet[n];
            //if (oItem['code'] == pCode) {            // ne serait plus nécessaire du fait de la modification de la structure OUFR_20160728
        //console.log(pageCode);                        // page004
        //if (oItem['file'] == pageCode) {
        if (k == nPageLeft) {
            //console.log(oItem['file']);
            //console.log(oItem);
            //console.log(oItem['hl']);
            //var sXML = "<"+"?xml version='1.0' encoding='UTF-8'?"+"><data>" + oItem['hl'] + "</data>";
            //var oDocument = $.parseXML(sXML);
            //console.log(oDocument);
            //console.log(oDocument.documentElement);
            //highlightsAdd(oDocument.documentElement, false);
            highlightsAdd(oItem["tRectangles"], false);
        //} else if (doublePage && (oItem['file'] == rightPageCode)) {
        } else if (doublePage && (k == nPageRight)) {
            //console.log(oItem['file']);
            //console.log(oItem);
            //console.log(oItem['hl']);
            //var sXML = "<"+"?xml version='1.0' encoding='UTF-8'?"+"><data>" + oItem['hl'] + "</data>";
            //var oDocument = $.parseXML(sXML);
            //console.log(oDocument);
            //console.log(oDocument.documentElement);
            //highlightsAdd(oDocument.documentElement, true);
            highlightsAdd(oItem["tRectangles"], true);
        }
            //}
    }
}
