var oDialog = null;
var dialogInitialized = false;        // ui dialog instancied
var oDialogList = null;
var dialogWidth, dialogHeight;
var oDiaporama = null;
var bDiaporamaStarted = false;
var sDiaporamaHTML = null;
var $j = null;
var oVideo = null;
var bVideoStarted = false;
var sVideoHTML = null;
var oScrollerArticlesList = null;
var deferResizeKPID = null;

$(document).ready(function(){
    //add window resize callback
    $(window).resize(function(){
        //executing window resize callback 1
    });
    $(window).resize(function(){
        //executing window resize callback 2, the one to resize KP JQuery UI dialog

        if (oDialog != null) {
            if (deferResizeKPID != null) {
                clearTimeout(deferResizeKPID);
                deferResizeKPID = null;
            }
            deferResizeKPID = setTimeout(function () {
                deferResizeKPID = null;
                _resizeKP();
            }, 1000);    // isAndroid ? 200 : 0);
        }
    });
});

function _resizeKP() {
    myDebug("_resizeKP");
    resizeDiaporama1();
    resizeVideo1();
    calcDialogSize();
    // à faire dans le bon ordre, min/max before width
    oDialog.dialog( "option", "minHeight", dialogHeight );
    oDialog.dialog( "option", "minWidth", dialogWidth );
    oDialog.dialog( "option", "maxHeight", dialogHeight );
    oDialog.dialog( "option", "maxWidth", dialogWidth );
    oDialog.dialog( "option", "height", dialogHeight );
    oDialog.dialog( "option", "width", dialogWidth );
    setTimeout(resizeDiaporama2, 2000); // resizeDiaporama2();
    setTimeout(resizeVideo2, 2000); // resizeDiaporama2();
}

function startDiaporama() {
    if (oDiaporama == null) {
        var oContainer = $(".sla-diaporama-container");
        var quadri = oContainer.attr("quadri");
        var dateParution = oContainer.attr("dateParution");
        var articleId = oContainer.attr("articleId");
        var diaporamaId = oContainer.attr("diaporamaId");
        var sDiaporamaName = oContainer.attr("diaporamaName");
        analyticsViewDiaporama(quadri, dateParution, articleId, diaporamaId, sDiaporamaName);
        oContainer.find("IMG").each(function() {
            var oImage = $(this);
            var photoId = oImage.attr("photoId");
            var photoName = oImage.attr("photoName");
            analyticsViewPhoto(quadri, dateParution, articleId, photoId, photoName);
        });
        //constructDiaporama
        oDiaporama = $('#slides');
        var oParent = oDiaporama.parent();
        sDiaporamaHTML = oParent.html();
        oDiaporama.slidesjs({
              navigation: {                // codage uniquement en mode fade des modifications concernant l'affichage d'images de tailles différentes centrées
                active: true,
                effect: "fade"
              },
              pagination: {
                active: true,
                effect: "fade"
              },
            play: {
                active: true,
                auto: true,
                interval: 2000,
                swap: true,
                effect: "fade"                // plus adapté avec des images de taille différentes et n'occupant pas tout l'espace
            }
        });
    } else {
        $(".slidesjs-play").click();
    }
    bDiaporamaStarted = true;
}

function stopDiaporama() {
    if (oDiaporama != null) {
        if (bDiaporamaStarted) {
            $(".slidesjs-stop").click();
            bDiaporamaStarted = false;
        }
    }
}

function killDiaporama() {
    if (oDiaporama != null) {
        // cleanup
        stopDiaporama();
        var oParent = oDiaporama.parent();
        oDiaporama.empty();            // obligatoire
        oDiaporama = null;            // obligatoire
        oParent.html(sDiaporamaHTML);
    }
}

function _loopDiaporama1(){
    stopDiaporama();
    killDiaporama();
    setTimeout(_loopDiaporama2, 1000);
}

function _loopDiaporama2() {
    startDiaporama();
    setTimeout(_loopDiaporama1, 1000);
}

function loopDiaporama() {
    _loopDiaporama1();
}

function calcDialogSize() {
    //var percent = 80; cette méthode pose un problème avec le diaporama qui est responsive en utilisant une css et des expressions du type @media (min-width: 768px)
    if (window.innerHeight) {
        dialogHeight = window.innerHeight;
        dialogWidth = window.innerWidth;
    } else {
        dialogHeight = $(window).height();
        dialogWidth = $(window).width();
    }
}

function closeDialog() {        // x onclick() inside dialog
    oDialog.dialog('close');
}

function createDialog(oDialog) {
    $(".ui-widget-overlay").bind("click",function(){
        myDebug("overlay click");
        closeDialog();
    });
    $(".ui-dialog-close-sla").click(function(){
        closeDialog();
    });
    $(".ui-widget-content").click(function(){
        leftPanel.close();
    });
}

function initDialogContent() {
    $(".group-button").click(function () {
        myDebug("group-button click");
        var that = $(this);
        var oParent = that.closest(".group-root");
        console.log(oParent);
        var oCurrent = oParent.find(".group-button-current");
        var currentGid = oCurrent.attr("gid");
        oCurrent.removeClass("group-button-current");
        that.addClass("group-button-current");
        oParent.find(".group-container").css("z-index", "-1");
        var newGid = that.attr("gid");
        console.log(newGid);
        var oContainer = oParent.find(".group-container[gid='" + newGid + "']");
        console.log(oContainer);
        oContainer.css("z-index", "0");
        if (currentGid != newGid) {
            if (currentGid == "diaporama") {
                stopDiaporama();
            } else if (currentGid == "video") {
                stopVideo();
            } else {
            }
            if (newGid == "diaporama") {
                analyticsEventReaderArticleDiaporama();
                startDiaporama();
            } else if (newGid == "video") {
                analyticsEventReaderArticleVideo();
                startVideo();
            } else {
                analyticsEventReaderArticleHtml();
            }
        }
    });
}

function killDialogContent() {
    if (oDialog == null) return;
    killDiaporama();
    killVideo();
}


function resizeVideo1() {
    if ($(".video").css("z-index") == "0") {
        //killVideo();
    }
}

function resizeVideo2() {
    if ($(".video").css("z-index") == "0") {
        //startVideo();
    }
    if (oVideo != null) {
        oVideo.resetSize();
    }
}

function resizeDiaporama1() {
    myDebug("resizeDiaporama1");
}

function resizeDiaporama2() {
    if (oDiaporama != null) {
        oDiaporama.data('plugin_slidesjs').update();
    }
}

function destroyDialog(oDialogUI) {
    killDialogContent();
    oDialog.find(".dialog-content-0").html("");

    // ensure dialog is destroyed
    setTimeout(function(){
        oDialog.dialog("destroy");
        oDialog = null;
        dialogInitialized = false;
    }, 0);
}

// la présence du diaporama perturbe le calcul des scrollbars

function preinitializeDialog() {
    oDialog = $("#dialog-article");
}

function initializeDialog() {
    if (dialogInitialized) return;
    dialogInitialized = true;
    calcDialogSize();
    oDialog.dialog({
        dialogClass: "ui-dialog-no-title-bar ui-dialog-no-buttonpane ui-dialog-no-border ui-dialog-article",    // ui-dialog-padding",
        closeOnEscape: true,
        draggable: false,
        resizable: false,
        modal: false,
        width: dialogWidth,
        minWidth: dialogWidth,
        maxWidth: dialogWidth,
        height: dialogHeight,
        minHeight: dialogHeight,
        maxHeight: dialogHeight,
        position: {
            my: "right top",
            at: "right top",
            of: window },
        buttons: {
            Fermer : function() {
                $(this).dialog("close");
            }
        },
        create: function(event, ui) {
        },
        close: function(event, ui) {
            var that = $(this);
            destroyDialog(that);
        },
        open: function(){
            var that = $(this);
            createDialog(that);
        },
        resize: function( event, ui ) {
        },
        resizeStop: function( event, ui ) {
        },
        show: {
            effect: "slide",
            duration: 400,
            direction: "right"
        },
        hide: {
            effect: "slide",
            duration: 400,
            direction: "right"
        }
    });
}

function displayArticleFromList(that, parutionId) { // appelé depuis la liste des articles
    var $that = $(that);
    var articleId = $that.attr("articleid");
    var oContainer = $that.closest(".article-items");
    oContainer.find(".article-current").removeClass("article-current");
    $that.addClass("article-read");
    $that.addClass("article-current");
    var currentSupplement = $(".supplement-items[parutionId=" + parutionId + "]");
    var sSubURL = (currentSupplement.length > 0) ? currentSupplement.attr("supplementHTMLDir") : sHTMLDir;
    killDialogContent();
    var sURL;
    if (bUseHTMLFiles) {
        sURL = sDomainExpr + sSubURL + "/" + articleId + ".html";
        $.ajax({
            type: "POST",
            url: sURL,
            data: 'articleId='+articleId+'&parutionId='+parutionId,
            success: function(data){
                var sHTML = data;
                sHTML = sHTML.replace(/%sDomainExpr%/g, sDomainExpr);
                preinitializeDialog();
                oDialog.find(".dialog-content-0").html(sHTML);
                // display dialog if not already displayed
                initializeDialog();
                initDialogContent();
                syncArticlesList(that);
                // if small screen automatically close the panel
                console.log($(window).width());
                if ($(window).width() <= 1024) {
                    leftPanel.close();
                }
            },
            error: function(data, transport) {
                printSysErrorMessage(data, transport, null);
            }
        });
    }
}

function loadArticlesList() {
    $("#slideleft").css("display", "block");
    leftPanel = new slideInMenu('slideleft', true, 2);
    leftPanel.adjustClosePosition(); // adjust base position
    leftPanel.adjustOpenPosition(); // adjust open position if opened
    leftPanel.showPanel();
    var sURL;
    var currentParutionId;
     // Cahier principal
    sURL = sDomainExpr + sHTMLDir + "/list.html";
    currentParutionId = getParutionID();
    $.ajax({
        type: "POST",
        url: sURL,
        async: false,
        success: function(content) {
            $("#dialog-list").find(".dialog-content-0").append(content);
            $("#dialog-list").find(".dialog-content-0 .article-group:not([articleGroupParutionId])").attr("articleGroupParutionId", currentParutionId).attr('baseUrl', sURL);
        }
    });
    // Suppléments
    var oSupplements = $(".supplement-items");
    if (oSupplements.length > 1) {
        oSupplements.each(function (index) {
            if (index != 0) {
                sURL = sDomainExpr + $(this).attr("supplementHTMLDir") + "/list.html";
                currentParutionId = $(this).attr("parutionId");
                $.ajax({
                    type: "POST",
                    url: sURL,
                    async: false,
                    success: function(content) {
                        $("#dialog-list").find(".dialog-content-0").append(content);
                        $("#dialog-list").find(".dialog-content-0 .article-group:not([articleGroupParutionId])").attr("articleGroupParutionId", currentParutionId).attr('baseUrl', sURL);
                    }
                });
            }
        });
    }
    var oWrapper = $("#dialog-list").find(".iScroll-wrapper");
    oScrollerArticlesList = new iScroll(oWrapper[0], { hScrollbar:false, vScrollbar:false, snap:false});
    setTimeout(function(){
        oScrollerArticlesList.refresh();
        syncArticlesListByPage();
    }, 100);
}

function displayArticleFromZoning(articleId, parutionId, bActivateDiaporama, bActivateVideo) {            // appelé depuis le zoning
    var sURL;
    if (bUseHTMLFiles) {
        sURL = sDomainExpr + sHTMLDir + "/" + articleId + ".html";
        $.ajax({
            type: "POST",
            url: sURL,
            data: 'articleId='+articleId+'&parutionId='+parutionId,
            success: function(data){
                //faire une fonction
                var sHTML = data;
                sHTML = sHTML.replace(/%sDomainExpr%/g, sDomainExpr);
                // --- set list current article
                var oContainer = $("#dialog-list").find(".article-items");
                oContainer.find(".article-current").removeClass("article-current");
                var s = ".article-item[articleid='" + articleId + "']";
                var oCurrentArticle = oContainer.find(s);
                if (oCurrentArticle.length != 0) {
                    oCurrentArticle.addClass("article-read");
                    oCurrentArticle.addClass("article-current");
                    syncArticlesList(oCurrentArticle.get(0));
                    preinitializeDialog();
                    oDialog.find(".dialog-content-0").html(sHTML);
                    setTimeout(function(){
                        initializeDialog();
                        initDialogContent();
                        if (bActivateDiaporama) {
                            $(".group-button[gid='diaporama']").click();
                        } else if (bActivateVideo) {
                            $(".group-button[gid='video']").click();
                        }
                    }, 0);
                }
            },
            error: function(data, transport) {
                printSysErrorMessage(data, transport, null);
            }
        });
    }
}

function showTabContent(oDiv) {
    analyticsEventReaderListTab();
    var $oDiv = $(oDiv);
    var gid = $oDiv.attr("tabid");
    var oContainer = $oDiv.closest(".article-groups");
    oContainer.find(".article-tab").removeClass("article-tab-visible");
    oContainer.find(".article-tab[tabid='" + gid +"']").addClass("article-tab-visible");
    /*oContainer.find(".article-group").removeClass("article-group-visible");
    oContainer.find(".article-group[groupid='" + gid +"']").addClass("article-group-visible");*/

    var oDialogList = getListDialog();
    var oGroupRoot = getGroupRoot(oDialogList);
    var oActiveGroup = getActiveGroup(oGroupRoot);
    oActiveGroup.removeClass("article-group-visible");
    var oCurrentArticle = getCurrentArticle(oActiveGroup);
    var aid = getArticleID(oCurrentArticle);
    var oNewGroup = getGroupByID(oGroupRoot, gid);
    oNewGroup.addClass("article-group-visible");
    var oCurrentArticle = getCurrentArticle(oNewGroup);
    oCurrentArticle.removeClass("article-current");
    var oArticle = getArticleByID(oNewGroup, aid);
    oArticle.addClass("article-current");
    setTimeout(function(){
        oScrollerArticlesList.refresh();
        syncArticlesList(oArticle[0]);
    }, 100);
}

function syncArticlesList(oItem) {            // DOM object not JQuery object
    oScrollerArticlesList.centerToElement(oItem, 0);
}
function syncArticlesListByPage() {
    // si nbpage est impaire
    if (nMax %2) {
        nMax++;
    }
    // nCurrent 1 ou double page 20 et 21
    var oDialogList = getListDialog();
    var oGroupRoot = getGroupRoot(oDialogList);
    var gid = "byPage";
    var oNewGroup = getGroupByID(oGroupRoot, gid);
    if (oNewGroup.length > 0) {     // on load page loaded before ajax terminated
        oNewGroup.find(".article-subgroup-label").each(function (){
            var $this = $(this);
            $this.removeClass("article-subgroup-label-active");
        });
        oItem = oNewGroup.find(".article-subgroup-label[pageid='" + nCurrent + "']");
        if (oItem.length > 0) {
            oItem.addClass("article-subgroup-label-active");
            oItem = oItem.get(0);
            if (doublePage) {
                if (nCurrent == 1) {
                    oScrollerArticlesList.centerToElement(oItem, 0);
                } else if (nCurrent == nMax) {
                    oScrollerArticlesList.centerToElement(oItem, 0);
                } else if (nCurrent % 2) {      // page impaire à droite
                    var n = nCurrent - 1;
                    oOtherItem = oNewGroup.find(".article-subgroup-label[pageid='" + n + "']");
                    if (oOtherItem.length > 0) {
                        oOtherItem.addClass("article-subgroup-label-active");
                        oOtherItem = oOtherItem.get(0);
                        oScrollerArticlesList.centerToElement(oOtherItem, 0);
                    }
                } else {
                    oScrollerArticlesList.centerToElement(oItem, 0);
                    var n = nCurrent + 1;
                    oOtherItem = oNewGroup.find(".article-subgroup-label[pageid='" + n + "']");
                    if (oOtherItem.length > 0) {
                        oOtherItem.addClass("article-subgroup-label-active");
                    }
                }
            } else {
                oScrollerArticlesList.centerToElement(oItem, 0);
            }
        }
    }
}

function getParutionID() {
    var oBody = $("BODY");
    var pid = oBody.attr("pid");
    return pid;
}

function getListDialog() {
    var oDialogList = $("#dialog-list");
    return oDialogList;
}

function getGroupRoot(oDialogList) {
    var oGroupRoot = oDialogList.find(".article-groups");//".dialog-content-0");
    return oGroupRoot;
}

function getActiveGroup(oGroupRoot) {
    // article-group article-group-visible
    var oActiveGroup = oGroupRoot.find(".article-group-visible");
    return oActiveGroup;
}

function getGroupByID(oGroupRoot, gid) {
    var oGroup = oGroupRoot.find(".article-group[groupid='" + gid +"']");
    return oGroup;
}

function getArticleByID(oGroup, aid) {
    var oArticle = oGroup.find(".article-item[articleid='" + aid +"']");
    return oArticle;
}

function getCurrentArticle(oActiveGroup) {
    var oArticles = oActiveGroup.find(".article-item");
    // article-item  article-read article-current
    var oCurrentArticle = oArticles.filter(".article-current");        // "[articleid='" + aid + "']");
    return oCurrentArticle;
}

function getArticleID(oArticle) {
    return oArticle.attr("articleid");
}

function getNextArticle(oActiveArticle) {
    var oNextArticle = oActiveArticle.next(".article-item");
    if (oNextArticle.length > 0) {
        return oNextArticle;
    }
    return null;
}

function getPrevArticle(oActiveArticle) {
    var oPrevArticle = oActiveArticle.prev(".article-item");
    myDebug(oPrevArticle);
    if (oPrevArticle.length > 0) {
        return oPrevArticle;
    }
    return null;
}

function getArticleSubgroup(oCurrentArticle) {
    var oSubgroup = oCurrentArticle.closest(".article-subgroup");
    if (oSubgroup.length > 0) {
        return oSubgroup;
    }
    return null;
}

function getNextSubgroup(oSubgroup) {
    var oNextSubgroup = oSubgroup.next(".article-subgroup");
    if (oNextSubgroup.length > 0) {
        return oNextSubgroup;
    }
    return null;
}

function getPrevSubgroup(oSubgroup) {
    var oPrevSubgroup = oSubgroup.prev(".article-subgroup");
    if (oPrevSubgroup.length > 0) {
        return oPrevSubgroup;
    }
    return null;
}

function getFirstArticle(oSubgroup) {
    var oArticles = oSubgroup.find(".article-item");
    var oNextArticle = oArticles.first();
    if (oNextArticle.length > 0) {
        return oNextArticle;
    }
    return null;
}

function getLastArticle(oSubgroup) {
    var oArticles = oSubgroup.find(".article-item");
    var oNextArticle = oArticles.last();
    if (oNextArticle.length > 0) {
        return oNextArticle;
    }
    return null;
}

function nextArticle() {
    var oDialogList = getListDialog();
    var oGroupRoot = getGroupRoot(oDialogList);
    var oActiveGroup = getActiveGroup(oGroupRoot);
    var oCurrentArticle = getCurrentArticle(oActiveGroup);
    var oNextArticle = getNextArticle(oCurrentArticle);
    if (oNextArticle != null) {
        var pid = getParutionID();
        displayArticleFromList(oNextArticle[0], pid);
    } else {
        var oSubgroup = getArticleSubgroup(oCurrentArticle);
        // next group may be empty
        for(;;) {
            var oSubgroup = getNextSubgroup(oSubgroup);
            if (oSubgroup != null) {
                var oNextArticle = getFirstArticle(oSubgroup);
                if (oNextArticle != null) {
                    var pid = getParutionID();
                    displayArticleFromList(oNextArticle[0], pid);
                    break;
                }
            } else {
                break;
            }
        }
    }
}

function prevArticle() {
    var oDialogList = getListDialog();
    var oGroupRoot = getGroupRoot(oDialogList);
    var oActiveGroup = getActiveGroup(oGroupRoot);
    var oCurrentArticle = getCurrentArticle(oActiveGroup);

    var oPrevArticle = getPrevArticle(oCurrentArticle);
    if (oPrevArticle != null) {
        var pid = getParutionID();
        displayArticleFromList(oPrevArticle[0], pid);
    } else {
        var oSubgroup = getArticleSubgroup(oCurrentArticle);
        // prev group may be empty
        for(;;) {
            var oSubgroup = getPrevSubgroup(oSubgroup);
            if (oSubgroup != null) {
                var oPrevArticle = getLastArticle(oSubgroup);
                if (oPrevArticle != null) {
                    var pid = getParutionID();
                    displayArticleFromList(oPrevArticle[0], pid);
                    break;
                }
            } else {
                break;
            }
        }
    }
}

function articleMouseDown(othis, event) {
    var $this = $(othis);
    var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
    xThumb = oOffset.left;
    myDebug(xThumb);
    yThumb = oOffset.top;
    myDebug(yThumb);
}

function articleClick(othis, event) {
    analyticsEventReaderListArticle();
    var $this = $(othis);
    var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
    x = oOffset.left;
    y = oOffset.top;
    var currentParutionId = $this.closest(".article-group").attr("articleGroupParutionId");
    if (xThumb == -1) {                    // click généré par iScroll
        displayArticleFromList(othis, currentParutionId);
        //alert("click filtered touch");
        xThumb = 0;
    } else if (Math.abs(x - xThumb) < 1 && Math.abs(y - yThumb) < 1) {        // vrai click
        displayArticleFromList(othis, currentParutionId);

    }
}
// passer les éléments distinct dans getZonin et renommer getZonn

var xZoning = 0;                    // CLICK-DISCARD éviter que mousedown + déplacement de la vignette dans iScroll + mouseup génère un click
var yZoning = 0;

function displayZoning() {
    var n = nAbsCurrent;
    var oRightContainer = $("#zoning_right");
    var oLeftContainer = $("#zoning_left");
    oRightContainer.html('');
    oLeftContainer.html('');
    if (doublePage) {
        if (n == 1) {
            var s = createZoning(n, 'right');
            s = s + createTools(n, 'right');
            oRightContainer.html(s);
        } else if (n == nMax) {
            var s = createZoning(n, 'left');
            s = s + createTools(n, 'left');
            oLeftContainer.html(s);
        } else if ((n % 2)) {                // impaire donc elle va apparaitre ˆ droite
            var s = createZoning(n,'right');
            s = s + createTools(n,'right');
            oRightContainer.html(s);
            s = createZoning(n - 1,'left');
            s = s + createTools(n - 1,'left');
            oLeftContainer.html(s);
        } else {
            var s = createZoning(n,'left');
            s = s + createTools(n,'left');
            oLeftContainer.html(s);
            s = createZoning(n + 1,'right');
            s = s + createTools(n + 1,'right');
            oRightContainer.html(s);
        }
    } else {
        if ((n % 2)) { // impaire donc elle va apparaitre ˆ droite
            var s = createZoning(n,'right');
            s = s + createTools(n,'right');
            oRightContainer.html(s);
        } else {
            var s = createZoning(n,'left');
            s = s + createTools(n,'left');
            oLeftContainer.html(s);
        }
    }
    var oRectangles = $(".zoningBloc");
    oRectangles.hover(
        function () {
            // rendre visibles tous les blocs de l'article
            $(".zoningBloc[articleId='"+$(this).attr('articleId')+"']").addClass("zoningBlocHover");
        },
        function () {
          // test FIGARO articleId may be a string
          $(".zoningBloc[articleId='"+$(this).attr('articleId')+"']").removeClass("zoningBlocHover");
        }
    );
    // onclick() incompatible avec le zoom dans la page, il faut utiliser mousedown, mouseup
    oRectangles.bind("touchstart", function(e) {
        var $this = $(this);
        var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
        //mémoriser dans un attribut plutot que variable
        xZoning = oOffset.left;
        myDebug(xZoning);
        yZoning = oOffset.top;
        myDebug(yZoning);
    });
    oRectangles.bind("mousedown", function(e) {
    });
    oRectangles.bind("mouseup", function(e) {
    });
    oRectangles.bind("click", function(e) {
    });
    oRectangles.bind("dblclick", function(e) {
    });
    oRectangles.bind("mousedown", function(e) {
        var $this = $(this);
        var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
        //mémoriser dans un attribut plutot que variable
        xZoning = oOffset.left;
        yZoning = oOffset.top;
    });
    oRectangles.click(function(e) {        // mouseup(function(event) {
        analyticsEventReaderPageZoning();
        var $this = $(this);
        var oOffset = $this.offset();            // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
        x = oOffset.left;
        y = oOffset.top;
        if (xZoning == 0) {                    // desktop version no touchstart event
            var aid = $this.attr("articleId");
            displayArticleFromZoning(aid, parutionId, false, false);
        } else if (xZoning == -1) {                    // click généré par iScroll
            var aid = $this.attr("articleId");
            displayArticleFromZoning(aid, parutionId, false, false);
            xZoning = 0;
        } else if (Math.abs(x - xZoning) < 1 && Math.abs(y - yZoning) < 1) {        // vrai click
            var aid = $this.attr("articleId");
            displayArticleFromZoning(aid, parutionId, false, false);
        }
    });
    var oRectangles = $(".ilinkBloc BUTTON");
    oRectangles.click(
        function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            var nPage = $(this).attr("nPage");
            analyticsEventReaderPageILink();
            gotoPage(nPage);
        }
    );
    var oRectangles = $(".elinkBloc BUTTON");
    oRectangles.click(
      function () {
        var sURL = $(this).attr("sURL");
        analyticsEventReaderPageELink();
        window.open(sURL);
      }
    );
    var oRectangles = $(".diaporamaBloc BUTTON");
    oRectangles.click(
      function () {
        var aid = $(this).attr("articleId");
        analyticsEventReaderPageDiaporama();
        displayArticleFromZoning(aid, parutionId, true, false);
      }
    );
    var oRectangles = $(".videoBloc BUTTON");
    oRectangles.click(
      function () {
        var aid = $(this).attr("articleId");
        analyticsEventReaderPageVideo();
        displayArticleFromZoning(aid, parutionId, false, true);
      }
    );
}

function getBigBlocks(nPage, pos) {
    var oArticles = {};
    // si il y a des blocs pour cette page
    if (typeof articles != 'undefined') {
        if (articles[nPage] != undefined) {
            for (i = 0; i < articles[nPage].length; i++) {
                var item = articles[nPage][i];
                var aid = item['articleId'];
                console.log(aid);
                var left = item['Left'];
                //myDebug(left);
                if (pos == 'right') {
                    // SLA Figaro left = parseInt(left) + singlePageWidth;
                    if (doublePage) {
                        left = parseInt(left) + nZoningRightGap;        // harry 100;
                    } else {
                        left = parseInt(left) - singlePageWidth + nZoningRightGap;        // harry 100;
                    }
                }
                var top = item['Top'];
                var h = item['Height'];
                var w = item['Width'];
                var right = left + w;
                var bottom = top + h;
                if (oArticles[aid] == undefined) {
                    oArticles[aid] = {left: left, top: top, right: right, bottom: bottom};
                } else {
                    var o = oArticles[aid];
                    if (o.left < left) left = o.left;
                    if (o.top < top) top = o.top;
                    if (o.right > right) right = o.right;
                    if (o.bottom > bottom) bottom = o.bottom;
                    oArticles[aid] = {left: left, top: top, right: right, bottom: bottom};
                }
            }
        }
    }
    return oArticles;
}

function createTools(nPage,pos) {        // nPage absolu, left/right, replace individual functions
    var zoningHtml = '';
    var oArticles = getBigBlocks(nPage, pos);
    for(var aid in oArticles) {
        var sTools = "";
        var oCoords = oArticles[aid];
        var right = oCoords['right'];
        var top = oCoords['top'];
        for(var propertyName in diaporamas) {
            if (diaporamas[propertyName] == aid) {
                sTools += '<div class="diaporamaBloc"><button articleId="'+aid+'"></button></div>';
                break;
            }
        }
        for(var propertyName in videos) {
            if (videos[propertyName] == aid) {
                sTools += '<div class="videoBloc"><button articleId="'+aid+'"></button></div>';
                break;
            }
        }
        for(var propertyName in ilinks) {
            if (propertyName == aid) {
                var nLink = ilinks[aid];
                sTools += '<div class="ilinkBloc"><button nPage="'+nLink+'"></button></div>';
                break;
            }
        }
        for(var propertyName in elinks) {
            if (propertyName == aid) {
                var sLink = elinks[aid];
                sTools += '<div class="elinkBloc"><button sURL="'+sLink+'"></button></div>';
                break;
            }
        }
        if (sTools != "")
            zoningHtml += '<div style="position: absolute; width: 1px; height: 1px; top:'+top+'px;left:'+right+'px;"><div style="position: relative;"><div articleId="'+aid+'" class="toolsBloc" style="position: absolute; right: 0px; top: 0px;">'+sTools+'</div></div></div>';
    }
    return zoningHtml;
}

function createDiaporama(nPage,pos) {        // nPage absolu, left/right
    var zoningHtml = '';
    var oArticles = getBigBlocks(nPage, pos);
    for(var aid in oArticles) {
        var bFound = false;
        // search article id in array
        for(var propertyName in diaporamas) {
            if (diaporamas[propertyName] == aid) {
                bFound = true;
                break;
            }
        }
        // l'article auquel appartient ce bloc n'a pas de diaporama
        if (!bFound) {
            continue;
        }
        var oCoords = oArticles[aid];
        var right = oCoords['right'];
        var top = oCoords['top'];
        var h = 100;
        var w = 100;
        right = right - 100;
        zoningHtml += '<div class="diaporamaBloc" style="top:'+top+'px;right:'+right+'px;"><button articleId="'+aid+'">TOTO</button></div>';
    }
    return zoningHtml;
}

function createVideo(nPage,pos) {        // nPage absolu, left/right
    var zoningHtml = '';
    var oArticles = getBigBlocks(nPage, pos);
    for(var aid in oArticles) {
        var bFound = false;
        // search article id in array
        for(var propertyName in videos) {
            if (videos[propertyName] == aid) {
                bFound = true;
                break;
            }
        }
        if (!bFound) { //diaporamas.hasOwnProperty(aid)) { //diaporamas.indexOf(aid) != -1) {
            continue;
        }
        var oCoords = oArticles[aid];
        var right = oCoords['right'];
        var top = oCoords['top'];
        var h = 100;
        var w = 100;
        right = right - 200;
        zoningHtml += '<div class="videoBloc" style="top:'+top+'px;right:'+right+'px;"><button articleId="'+aid+'">TOTO</button></div>';
    }
    return zoningHtml;
}

function createILink(nPage,pos) {        // nPage absolu, left/right
    var zoningHtml = '';
    var oArticles = getBigBlocks(nPage, pos);
    for(var aid in oArticles) {
        var bFound = false;
        // search article id in array
        for(var propertyName in ilinks) {
            if (propertyName == aid) {
                bFound = true;
                break;
            }
        }
        if (!bFound) { //diaporamas.hasOwnProperty(aid)) { //diaporamas.indexOf(aid) != -1) {
            continue;
        }
        var nLink = ilinks[aid];
        var oCoords = oArticles[aid];
        var right = oCoords['right'];
        var top = oCoords['top'];
        var h = 100;
        var w = 100;
        right = right - 300;
        zoningHtml += '<div class="ilinkBloc" style="top:'+top+'px;right:'+right+'px;"><button nPage="'+nLink+'">'+nLink+'</button></div>';
    }
    return zoningHtml;
}

function createELink(nPage,pos) {        // nPage absolu, left/right
    var zoningHtml = '';
    var oArticles = getBigBlocks(nPage, pos);
    for(var aid in oArticles) {
        var bFound = false;
        // search article id in array
        for(var propertyName in elinks) {
            if (propertyName == aid) {
                bFound = true;
                break;
            }
        }
        if (!bFound) { //diaporamas.hasOwnProperty(aid)) { //diaporamas.indexOf(aid) != -1) {
            continue;
        }
        var sLink = elinks[aid];
        var oCoords = oArticles[aid];
        var right = oCoords['right'];
        var top = oCoords['top'];
        var h = 100;
        var w = 100;
        right = right - 400;
        zoningHtml += '<div class="elinkBloc" style="top:'+top+'px;right:'+right+'px;"><button sURL="'+sLink+'">TOTO</button></div>';
    }
    return zoningHtml;
}

function createZoning(entry,pos) {        // nPage absolu, left/right
    /*
    // test FIGARO
    // à revoir, le numéro de page n'est pas global
    // SLA Figaro get absolute page number from thumbs
    */

    var zoningHtml = '';
    if (typeof articles != 'undefined') {
        if (articles[entry] !== undefined) {
            for (i = 0; i < articles[entry].length; i++) {
                var item = articles[entry][i];
                var left = item['Left'];
                //myDebug(left);
                if (pos == 'right') {
                    // SLA Figaro left = parseInt(left) + singlePageWidth;
                    if (doublePage) {
                        left = parseInt(left) + nZoningRightGap;        // harry 100;
                    } else {
                        left = parseInt(left) - singlePageWidth + nZoningRightGap;        // harry 100;
                    }
                }
                var top = item['Top'];
                var h = item['Height'];
                var w = item['Width'];
                var aid = item['articleId'];
                var pid = item['parutionId'];
                // test FIGARO, articleId may be a string, parutionCode is null, added permanent visibility zoningBlocHover
                zoningHtml += '<div class="zoningBloc zoning_article_'+aid+'" articleId="'+aid+'" style="height:'+h+'px;width:'+w+'px;top:'+top+'px;left:'+left+'px;"></div>';
            }
        }
    }

    return zoningHtml;
}
