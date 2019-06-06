    var oDialogDownload = null;
    function kdownloadDocument(sSelector, sSelector1, sSelector2) {            // callDwnPage() {
        $("#downFrom").val(1);
        $("#downTo").val(nMax);
        //if (doublePage && nCurrent != 1 && nCurrent != nMax) {
            var oContainer = $(sSelector);
            var oPage1 = oContainer.find(sSelector1);
            var oPage2 = oContainer.find(sSelector2);
            var oDialog = $("#dialog-down");
            var oThumb1 = oDialog.find("#page1");
            var oThumb2 = oDialog.find("#page2");
            oThumb1.css('display','inline-block');
            oThumb2.css('display','inline-block');
            if (doublePage && nCurrent != 1 && nCurrent != nMax) {
                var nLeftItem  = (nCurrent % 2) ? (nCurrent - 1) : nCurrent;
                var nRightItem = (nCurrent % 2) ? nCurrent : (nCurrent + 1);
                oThumb1.find("#img1").attr("src", oPage1.attr("sThumbDir") + "/" + oPage1.attr("sThumbFile")).attr('nItem',nLeftItem);
                oThumb2.find("#img1").attr("src", oPage2.attr("sThumbDir") + "/" + oPage2.attr("sThumbFile")).attr('nItem',nRightItem);
            } else {
                if (nCurrent % 2) {
                    oThumb1.css('display','none');
                    oThumb2.find("#img1").attr("src", oPage2.attr("sThumbDir") + "/" + oPage2.attr("sThumbFile")).attr('nItem',nCurrent);
                } else {
                    oThumb1.find("#img1").attr("src", oPage1.attr("sThumbDir") + "/" + oPage1.attr("sThumbFile")).attr('nItem',nCurrent);
                    oThumb2.css('display','none');
                }
            }
            openDownloadDialog();
    }
    function openDownloadDialog() {
        oDialogDownload = $( "#dialog-down" );
        oDialogDownload.dialog({
            resizable: false,
            height: "auto",
            width: "auto",
            modal: true,
            dialogClass: "dialog-down dialog-print-player",            // obligatoire sinon la boite n'apparait pas .dialogParent .ui-dialog-titlebar-close { display: none;
            buttons: {
                "Annuler": function() {
                    closeDownloadDialog();
                }
            }
        });
    }
    function closeDownloadDialog() {
        oDialogDownload.dialog( "close" );
        setTimeout(function(oDialog){
            oDialog.dialog("destroy");
        }, 0, oDialogDownload);
    }

// avant pCode contenait FIGA_20170209
function dwnParution() {
    analyticsViewPageDownload(pCode, parutionDate, 'all');
    var oRoot = $('.liseuse-panel-block12');
    var wid = 'container-page-list';
    var oWrapper = oRoot.find('#' + wid);
    var oSupplement = getSupplementFromID(oWrapper, pCode);
    var sDir = oSupplement.attr('sDir');
    var sDateParution = oSupplement.attr('sDateParution');

    // Temporaire, la date est réécrite a la volée
    var date = sDateParution.split('.')[2] + sDateParution.split('.')[1] + sDateParution.split('.')[0];

    var sFilename = pCode + '_' + date + '.pdf';
    var path = sDir + '/';
    var watermarkContent = 'c:' + clientName + ';u:' + ga_title;

    var page = 'download.php?fileName=' + sFilename + '&file=' + sFilename + '&path=' + path + '&watermarkContent=' + watermarkContent;

    window.open(page, '_blank');
}

function dwnPage(nItem) {
    analyticsViewPageDownload(pCode, parutionDate, nItem);
    var oRoot = $('.liseuse-panel-block12');
    var wid = 'container-page-list';
    var oWrapper = oRoot.find('#' + wid);
    var oSupplement = getSupplementFromID(oWrapper, pCode);
    var sDir = oSupplement.attr('sDir');
    var sDateParution = oSupplement.attr('sDateParution');

    // Temporaire, la date est réécrite a la volée
    var date = sDateParution.split('.')[2] + sDateParution.split('.')[1] + sDateParution.split('.')[0];

    var multi = new Array();
    multi.push(nItem);

    var sFilename = pCode + "_" + date + '.pdf';
    var downloadFileName = 'page_' + left_pad(nItem, 3) + '.pdf';
    var path = sDir + '/';
    var watermarkContent = 'c:' + clientName + ';u:' + ga_title;

    var page = 'download.php?multi=' + JSON.stringify(multi) + '&fileName=' + downloadFileName + '&file=' + sFilename + '&path=' + path + '&watermarkContent=' + watermarkContent;

    window.open(page, '_blank');
}

function dwnMulti() {
    var from = parseInt($('#downFrom').val());
    var to = parseInt($('#downTo').val());

    analyticsViewPageDownload(pCode, parutionDate, from + '-' + to);
    var oRoot = $('.liseuse-panel-block12');
    var wid = 'container-page-list';
    var oWrapper = oRoot.find('#' + wid);
    var oSupplement = getSupplementFromID(oWrapper, pCode);
    var sDir = oSupplement.attr('sDir');
    var sDateParution = oSupplement.attr('sDateParution');

    // Temporaire, la date est réécrite a la volée
    var date = sDateParution.split('.')[2] + sDateParution.split('.')[1] + sDateParution.split('.')[0];

    if (from > to) {
        alert('Séquence ' + from + '>' + to + ' incorrecte');
    } else {
        from = Math.max(from, 1);
        to = Math.min(to, nMax);
        var multi = new Array();
        for (i = from; i <= to; i++) {
            multi.push(i);
        }
        if (multi.length > 0) {
            var sFilename = pCode + "_" + date + '.pdf';
            var downloadFileName = 'page_' + left_pad(multi[0], 3) + '_' + left_pad(multi[multi.length - 1], 3) + '.pdf';
            var path = sDir + '/';
            var watermarkContent = 'c:' + clientName + ';u:' + ga_title;

            var page = 'download.php?multi=' + JSON.stringify(multi) + '&fileName=' + downloadFileName + '&file=' + sFilename + '&path=' + path + '&watermarkContent=' + watermarkContent;

            window.open(page, '_blank');
        } else {
            alert('Séquence ' + from + '>' + to + ' incorrecte');
        }
    }
}