    var oDialogPrint = null;
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    function kprintArticle(sSelector, sTitle, articleId, sArticleTitle) {            // main entry point
        var oArticle = oDialog.find(".group-container-article");                // oDialog = $("#dialog-article");
        kcleanUp();
        // load hidden frame only when it is needed
        var oFrame = $("<iframe/>", {
            id: "dynamic-frame-print",
            style: "display: none; position: absolute; z-index: -2000; top: 100px; left: 10px; width: 200px; height: 200px; owidth: 0px; oheight: 0px;"
        });
        oFrame.get(0).onload = function(evt) {
            var oFrame = $(this);
            var oHtml = oFrame.contents().find('html');

            // set title
            oHtml.find('head').find('title').html(sTitle);

            // set handler
            // sauf que si il n'y a aucun visuel alors le print ne sera pas déclenché
            kprintPrintWhenEverythingIsLoaded($(this), oHtml, 2, articleId, sArticleTitle);

            var oBody = oHtml.find('body');
            var sHTML = oArticle.html();
            oBody.html(sHTML);
        }
        $('body').prepend(oFrame);            /* this must be done */
        oFrame.get(0).src = "kframeArticle.php";
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    function kprintDocument(doublePage, sSelector, sSelector1, sSelector2, sTitle, bFitToWidth, bPortrait) {            // main entry point
        //doublePage = undefined;
        $("#printFrom").val(1);
        $("#printTo").val(nMax);
        //if (doublePage && nCurrent != 1 && nCurrent != nMax) {
            //console.log('doublePage');
            console.log("selector="); console.log(sSelector);
            var oContainer = $(sSelector);
            console.log("selector1="); console.log(sSelector1);
            var oPage1 = oContainer.find(sSelector1);
            var oPage2 = oContainer.find(sSelector2);
            var oDialog = $("#dialog-print");
            var oThumb1 = oDialog.find("#page1");
            var oThumb2 = oDialog.find("#page2");
            var oTitle = oDialog.find("#sTitle");
            oTitle.val(sTitle);

            var oFitToWidth = oDialog.find("#bFitToWidth");
            if (bFitToWidth) oFitToWidth.val("1");
            else oFitToWidth.val("0");

            var oPortrait = oDialog.find("#bPortrait");
            if (bPortrait) oPortrait.val("1");
            else oPortrait.val("0");

            oThumb1.css('display','inline-block');
            oThumb2.css('display','inline-block');
            if (doublePage && nCurrent != 1 && nCurrent != nMax) {

                $(".doublePrintAction").css('display','block');

                oThumb1.find("#img1").attr("src", oPage1.attr("sThumbDir") + "/" + oPage1.attr("sThumbFile"));

                oThumb1.attr("nPage", oPage1.attr("nPage"));

                oThumb1.attr("jpg1", oPage1.attr("jpg1"));        // saved information allow print before zoom find(".image-quart-top-left").attr("src"));
                oThumb1.attr("jpg2", oPage1.attr("jpg2"));        // saved information allow print before zoom find(".image-quart-top-right").attr("src"));
                oThumb1.attr("jpg3", oPage1.attr("jpg3"));        // saved information allow print before zoom find(".image-quart-bottom-left").attr("src"));
                oThumb1.attr("jpg4", oPage1.attr("jpg4"));        // saved information allow print before zoom find(".image-quart-bottom-right").attr("src"));


                oThumb2.attr("nPage", oPage2.attr("nPage"));

                oThumb2.find("#img1").attr("src", oPage2.attr("sThumbDir") + "/" + oPage2.attr("sThumbFile"));
                oThumb2.attr("jpg1", oPage2.attr("jpg1"));        // saved information allow print before zoom find(".image-quart-top-left").attr("src"));
                oThumb2.attr("jpg2", oPage2.attr("jpg2"));        // saved information allow print before zoom find(".image-quart-top-right").attr("src"));
                oThumb2.attr("jpg3", oPage2.attr("jpg3"));        // saved information allow print before zoom find(".image-quart-bottom-left").attr("src"));
                oThumb2.attr("jpg4", oPage2.attr("jpg4"));        // saved information allow print before zoom find(".image-quart-bottom-right").attr("src"));     

            } else {

                $(".doublePrintAction").css('display','none');

                if (nCurrent % 2) {
                    oThumb1.css('display','none');
                    console.log("page2="); console.log(oPage2);
                    oThumb2.find("#img1").attr("src", oPage2.attr("sThumbDir") + "/" + oPage2.attr("sThumbFile"));

                    oThumb2.attr("nPage", oPage2.attr("nPage"));

                    oThumb2.attr("jpg1", oPage2.attr("jpg1"));        // saved information allow print before zoom find(".image-quart-top-left").attr("src"));
                    oThumb2.attr("jpg2", oPage2.attr("jpg2"));        // saved information allow print before zoom find(".image-quart-top-right").attr("src"));
                    oThumb2.attr("jpg3", oPage2.attr("jpg3"));        // saved information allow print before zoom find(".image-quart-bottom-left").attr("src"));
                    oThumb2.attr("jpg4", oPage2.attr("jpg4"));        // saved information allow print before zoom find(".image-quart-bottom-right").attr("src"));                            
                } else {
                    console.log("page1="); console.log(oPage1);
                    oThumb1.find("#img1").attr("src", oPage1.attr("sThumbDir") + "/" + oPage1.attr("sThumbFile"));

                    oThumb1.attr("nPage", oPage1.attr("nPage"));

                    oThumb1.attr("jpg1", oPage1.attr("jpg1"));        // saved information allow print before zoom find(".image-quart-top-left").attr("src"));
                    oThumb1.attr("jpg2", oPage1.attr("jpg2"));        // saved information allow print before zoom find(".image-quart-top-right").attr("src"));
                    oThumb1.attr("jpg3", oPage1.attr("jpg3"));        // saved information allow print before zoom find(".image-quart-bottom-left").attr("src"));
                    oThumb1.attr("jpg4", oPage1.attr("jpg4"));        // saved information allow print before zoom find(".image-quart-bottom-right").attr("src"));

                    oThumb2.css('display','none');
                }
            }

            openPrintDialog();
    }

    function openPrintDialog() {
            oDialogPrint = $( "#dialog-print" );
            oDialogPrint.dialog({
                resizable: false,
                height: "auto",
                width: "auto",
                modal: true,
                dialogClass: "dialog-print dialog-print-player",            // obligatoire sinon la boite n'apparait pas .dialogParent .ui-dialog-titlebar-close { display: none;
                buttons: {
                    "Annuler": function() {
                        closePrintDialog();
                    }
                }
            });
    }
    function closePrintDialog() {
        oDialogPrint.dialog( "close" );
        setTimeout(function(oDialog){
            oDialog.dialog("destroy");
        }, 0, oDialogPrint);
    }
    
    //---------------------------------------------------------------------------------------------------------------------------------------------------
    function printPage(oPage, bRightPage) {                // called thru the dialog
        oPage = $(oPage);
        var oDialog = $(oPage).closest(".print-dialog");
        var sTitle = oDialog.find("#sTitle").val();

        var bFitToWidth = oDialog.find("#bFitToWidth").val();
        if (bFitToWidth == "1") {
            bFitToWidth = true;
        } else {
            bFitToWidth = false;
        }

        var bPortrait = oDialog.find("#bPortrait").val();
        if (bPortrait == "1") {
            bPortrait = true;
        } else {
            bPortrait = false;
        }

        kprintSinglePage(oPage, sTitle, bFitToWidth, bPortrait, true);
        closePrintDialog();
    }

function printDoublePage(oDiv, bDoublePage) {                    // called thru the dialog
    var oDialog = $(oDiv).closest(".print-dialog");
    var oPage1 = oDialog.find("#page1");
    var oPage2 = oDialog.find("#page2");
    var sTitle = oDialog.find("#sTitle").val();

    var bFitToWidth = oDialog.find("#bFitToWidth").val();
    if (bFitToWidth == "1") {
        bFitToWidth = true;
    } else {
        bFitToWidth = false;
    }

    var bPortrait = oDialog.find("#bPortrait").val();
    if (bPortrait == "1") {
        bPortrait = true;
    } else {
        bPortrait = false;
    }

    if (bDoublePage) {                                        // double page
        kprintDoublePage(oPage1, oPage2, sTitle, bFitToWidth, bPortrait);
    } else {                                                        // les deux pages l'une apr�s l'autre
        kprint2SinglePages(oPage1, oPage2, sTitle, bFitToWidth, bPortrait);
    }
    closePrintDialog();
}

var timeoutLoadThumb = null;

function kprintPrintWhenEverythingIsLoaded(oFrame, oBody, nKind, articleId, sTitle) {            // be sure ajax executed i.e. items have been created before calling this function
    // ensure images are loaded before printing
    myDebug("kprintPrintWhenEverythingIsLoaded");
    window.clearTimeout(timeoutLoadThumb);
    timeoutLoadThumb = setTimeout(fnLoadThumb, 250, oFrame, oBody, nKind, articleId, sTitle);
}

function fnLoadThumb(oFrame, oBody, nKind, articleId, sTitle) {
    timeoutLoadThumb = null;
    var bEnded = true;
    var t = oBody.find('img');
    if (t.length) {
        t.each(function () {
            if (!$(this).get(0).complete) bEnded = false;
        });
        if (!bEnded) {
            timeoutLoadThumb = setTimeout(fnLoadThumb, 250, oFrame, oBody, nKind, articleId, sTitle);
        } else {
            runPrint(oFrame, nKind, articleId, sTitle);
        }
    } else {                // no image
        runPrint(oFrame, nKind, articleId, sTitle);
    }
}


//---
/*
The use of frames[] to address an array of iframe objects is IE-only.

if (iframe.contentDocument) // FF Chrome
  doc = iframe.contentDocument;
else if ( iframe.contentWindow ) // IE
  doc = iframe.contentWindow.document;

The contentDocument property refers to the document element inside the iframe (this is equivalent to contentWindow.document), but is not supported by Internet Explorer versions before IE8.
*/
//---

function runPrint(oFrame, nKind, articleId, sTitle) {
    if (nKind == 1) {
        analyticsViewPagePrint(pCode, parutionDate, sTitle);
    } else {
        analyticsViewArticlePrint(pCode, parutionDate, 0, sTitle);
    }
    var id = oFrame.attr("id");
    // using id may make us touch wrong one if exist multiple frame having the same id var iframe = document.frames ? document.frames[id] : document.getElementById(id);
    var iframe = oFrame.get(0);
    iframe.focus();
    var iframe = document.frames ? document.frames[id] : document.getElementById(id);
    var ifWin = iframe.contentWindow || iframe;

    if(1) {
        var browserName = navigator.userAgent.toLowerCase();
        // Firefox = Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0
        // IE11 = mozilla/5.0 (windows nt 10.0; wow64; trident/7.0; .net4.0c; .net4.0e; .net clr 2.0.50727; .net clr 3.0.30729; .net clr 3.5.30729; tablet pc 2.0; rv:11.0) like gecko
        if (browserName.indexOf("msie") != -1) {                // old IE versions
            ifWin.printMe();
        } else if (browserName.indexOf("trident") != -1) {        // IE 11
            //ifWin.document.execCommand('print', false, null);
            var target = document.getElementById(id);
            target.contentWindow.document.execCommand('print', false, null);
        } else {                                                // FF, ...
            ifWin.printMe();
        }
    }
}

function kcleanUp() {
    var id = "dynamic-frame-print";
    var iframe = document.getElementById(id);        // IE no parentElement available document.frames ? document.frames[id] : document.getElementById(id);
    if (iframe !== null) {
        iframe.parentElement.removeChild(iframe);
    }
}

function kprintSinglePage(oPage, sTitle, bFitToWidth, bPortrait, bThumb) {
        kcleanUp();
        // load hidden frame only when it is needed width: 200px; height: 200px;
        var oFrame = $("<iframe/>", {
            id: "dynamic-frame-print",
            style: "position: absolute; z-index: -2000; top: 100px; left: 10px; width: 0px; height: 0px;"
        });
        oFrame.get(0).onload = function(evt) {
            var oFrame = $(this);
            var oHtml = oFrame.contents().find('html');

            oHtml.find('head').find('title').html(sTitle);

            var nPage = oPage.attr("nPage");
            // set handler
            kprintPrintWhenEverythingIsLoaded($(this), oHtml, 1, 0, nPage);

            var oBody = oHtml.find('body');
            if (bThumb) {
                var jpg1 = oPage.attr("jpg1");
                var jpg2 = oPage.attr("jpg2");
                var jpg3 = oPage.attr("jpg3");
                var jpg4 = oPage.attr("jpg4");
            } else {
                var jpg1 = oPage.find(".image-quart-top-left").attr("src");
                var jpg2 = oPage.find(".image-quart-top-right").attr("src");
                var jpg3 = oPage.find(".image-quart-bottom-left").attr("src");
                var jpg4 = oPage.find(".image-quart-bottom-right").attr("src");
            }

            var oImg = $('<div class="pageBreakAfter"><div class="page"><img src="' + jpg1 + '"/><img src="' + jpg2 + '"/><br/><img src="' + jpg3 + '"/><img src="' + jpg4 + '"/></div></div>');
            oBody.append(oImg);

            if (bPortrait) {
                oHtml.find("body").addClass("portrait-is-optimum");
            } else {
                oHtml.find("body").addClass("landscape-is-optimum");
            }
            if (bFitToWidth) {
                oHtml.find("img").addClass("fitToWidth");
            } else {
                oHtml.find("img").addClass("fitToHeight");
            }
        };

        $('body').prepend(oFrame);            /* this must be done */
        oFrame.get(0).src = "kframe1.php";
}

function kprintDoublePage(oPage1, oPage2, sTitle, bFitToWidth, bPortrait) {
    kcleanUp();
    // load hidden frame only when it is needed width: 400px; height: 600px; width: 200px; height: 100px;
    var oFrame = $("<iframe/>", {
        id: "dynamic-frame-print",
        src: "kframe2.php",
        style: "position: absolute; z-index: -2000; top: 300px; left: 10px; width: 0px; height: 0px;",
        load: function() {
            var oHtml = oFrame.contents().find('html');
            // set title
            oHtml.find('head').find('title').html(sTitle);
            // set handler
            var nPage1 = oPage1.attr("nPage");
            var nPage2 = oPage2.attr("nPage");
            kprintPrintWhenEverythingIsLoaded($(this), oHtml, 1, 0, nPage1 + "," + nPage2);

            var oBody = oHtml.find('body');

            var jpg1 = oPage1.attr("jpg1");
            var jpg2 = oPage1.attr("jpg2");
            var jpg3 = oPage1.attr("jpg3");
            var jpg4 = oPage1.attr("jpg4");

            var jpg1r = oPage2.attr("jpg1");
            var jpg2r = oPage2.attr("jpg2");
            var jpg3r = oPage2.attr("jpg3");
            var jpg4r = oPage2.attr("jpg4");
            var oImg = $('<div class="pageBreakAfter"><div class="page"><img src="' + jpg1 + '"/><img src="' + jpg2 + '"/><br/><img src="' + jpg3 + '"/><img src="' + jpg4 + '"/></div><div class="page"><img src="' + jpg1r + '"/><img src="' + jpg2r + '"/><br/><img src="' + jpg3r + '"/><img src="' + jpg4r + '"/></div></div>');
            oBody.append(oImg);

            if (1) {//bFitToWidth) {		// SLA 2017-09-07 fitToHeight donne un mauvais résultat sour chrome
                oBody.find(".page").addClass("fitToWidth");
                oBody.find("img").addClass("fitToWidth");
            } else {
                oBody.find(".page").addClass("fitToHeight");
                oBody.find("img").addClass("fitToHeight");
            }
        }
    });
    $('body').prepend(oFrame);            /* this must be done */
}

function kprint2SinglePages(oPage1, oPage2, sTitle, bFitToWidth, bPortrait) {
    kcleanUp();
    // load hidden frame only when it is needed owidth: 400px; oheight: 600px;
    var oFrame = $("<iframe/>", {
        id: "dynamic-frame-print",
        src: "kframe1.php",
        style: "position: absolute; z-index: -2000; top: 300px; left: 10px; width: 0px; height: 0px;",
        load: function() {
            console.log("iframe loaded !");
            var oHtml = oFrame.contents().find('html');
            // set title
            oHtml.find('head').find('title').html(sTitle);

            // set handler
            var nPage1 = oPage1.attr("nPage");
            var nPage2 = oPage2.attr("nPage");
            kprintPrintWhenEverythingIsLoaded($(this), oHtml, 1, 0, nPage1 + ";" + nPage2);

            var oBody = oHtml.find('body');

            var jpg1 = oPage1.attr("jpg1");
            var jpg2 = oPage1.attr("jpg2");
            var jpg3 = oPage1.attr("jpg3");
            var jpg4 = oPage1.attr("jpg4");
            var oImg = $('<div class="pageBreakAfter"><div class="page"><img src="' + jpg1 + '"/><img src="' + jpg2 + '"/><br/><img src="' + jpg3 + '"/><img src="' + jpg4 + '"/></div></div>');
            oBody.append(oImg);

            var jpg1 = oPage2.attr("jpg1");
            var jpg2 = oPage2.attr("jpg2");
            var jpg3 = oPage2.attr("jpg3");
            var jpg4 = oPage2.attr("jpg4");
            var oImg = $('<div class="pageBreakAfter"><div class="page"><img src="' + jpg1 + '"/><img src="' + jpg2 + '"/><br/><img src="' + jpg3 + '"/><img src="' + jpg4 + '"/></div></div>');
            oBody.append(oImg);

            if (bFitToWidth) {
                //oBody.find(".page").addClass("fitToWidth");
                oBody.find("img").addClass("fitToWidth");
            } else {
                //oBody.find(".page").addClass("fitToHeight");
                oBody.find("img").addClass("fitToHeight");
            }
        }
    });
    $('body').prepend(oFrame);            /* this must be done */
}

function printMultiplePage(oDiv) {
    var from = parseInt($("#printFrom").val());
    var to = parseInt($("#printTo").val());
    from = Math.max(from,1);
    to = Math.min(to,nMax);
    if (from > to) {
        alert('Séquence '+from+'>'+to+' incorrecte');
    } else {
        var sImageExpr = "page%03p_%n.jpg";					// now unused
        var oDialog = $(oDiv).closest(".print-dialog");
        var sTitle = oDialog.find("#sTitle").val();

        var bFitToWidth = oDialog.find("#bFitToWidth").val();
        if (bFitToWidth == "1") {
            bFitToWidth = true;
        } else {
            bFitToWidth = false;
        }

        var bPortrait = oDialog.find("#bPortrait").val();
        if (bPortrait == "1") {
            bPortrait = true;
        } else  {
            bPortrait = false;
        }
        kcleanUp();
        // load hidden frame only when it is needed
        var oFrame = $("<iframe/>", {
            id: "dynamic-frame-print",
            src: "kframe1.php",
            style: "position: absolute; z-index: -2000; top: 300px; left: 10px; owidth: 400px; oheight: 600px; width: 0px; height: 0px;",
            load: function() {
                console.log("iframe loaded !");
                var oHtml = oFrame.contents().find('html');
                //var s = oHtml.find('head').find('title').html();
                //console.log(s);

                // set title
                oHtml.find('head').find('title').html(sTitle);

                // set handler
                kprintPrintWhenEverythingIsLoaded($(this), oHtml, 1, 0, from + "-" + to);

                var oBody = oHtml.find('body');
                console.log(oBody);

                                    for (var indexPage=from; indexPage<=to; indexPage++) {
                                        var jpg1 = buildImageName4(indexPage, sDomainExpr, sImageDir, sImageExpr, 1);
                                        var jpg2 = buildImageName4(indexPage, sDomainExpr, sImageDir, sImageExpr, 2);
                                        var jpg3 = buildImageName4(indexPage, sDomainExpr, sImageDir, sImageExpr, 3);
                                        var jpg4 = buildImageName4(indexPage, sDomainExpr, sImageDir, sImageExpr, 4);
                                        var oImg = $('<div class="pageBreakAfter"><div class="page"><img src="' + jpg1 + '"/><img src="' + jpg2 + '"/><br/><img src="' + jpg3 + '"/><img src="' + jpg4 + '"/></div></div>');
                                        oBody.append(oImg);
                                        console.log(oImg);
                                    }

                if (bFitToWidth) {
                    //oBody.find(".page").addClass("fitToWidth");
                    oBody.find("img").addClass("fitToWidth");
                } else {
                    //oBody.find(".page").addClass("fitToHeight");
                    oBody.find("img").addClass("fitToHeight");
                }
            }
        });
        $('body').prepend(oFrame);            /* this must be done */
    }
    closePrintDialog();
}