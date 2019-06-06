function SwitchDisplayFromSize(bLoadPage, bSetSingleDoublePageMode, bSetPageWidth) {
    myDebug("switchDisplayFromSize, automatically select single or double page mode");
    myDebug("bLoadPage=" + bLoadPage);
    myDebug("bSetSingleDoublePageMode=" + bSetSingleDoublePageMode);
    myDebug("bSetPageWidth=" + bSetPageWidth);
    //if (bLoadPage == undefined) bLoadPage = true;
    if (window.innerHeight) {
        var zoneHeight = window.innerHeight;
        var zoneWidth = window.innerWidth;
    } else {
        var zoneHeight = $(window).height();
        var zoneWidth = $(window).width();
    }
    if (zoneHeight > zoneWidth) { // PORTRAIT
        if (doublePage == undefined) {
            myDebug("mode single/double page undefined");
            setGlobalVariablesSingleDoublePageMode(false);
            if (bSetPageWidth) setGlobalVariablesPageWidth();
    if (bLoadPage) {
        setCSSScrollerSize("#wrapper", "#scroller", myScroll);
        _loadCurrentPage();
    }
        } else if (doublePage) {
            //setPageModeToSingle(bLoadPage);
            setGlobalVariablesSingleDoublePageMode(false);
            if (bSetPageWidth) setGlobalVariablesPageWidth();
    if (bLoadPage) {
        setCSSScrollerSize("#wrapper", "#scroller", myScroll);
        _loadCurrentPage();
    }
        } else {
            myDebug("déjà en simple page");
        }
    } else { // PAYSAGE
        if (doublePage == undefined) {
            myDebug("mode single/double page undefined");
            setGlobalVariablesSingleDoublePageMode(true);
            if (bSetPageWidth) setGlobalVariablesPageWidth();
    if (bLoadPage) {
        imageMakeLeftVisible("#wrapper");            // the right one is always visible, just hidden because of the wrapper width
        setCSSScrollerSize("#wrapper", "#scroller", myScroll);
        _loadCurrentPage();
    }
        } else if (!doublePage) {
            //setPageModeToDouble(bLoadPage);
            setGlobalVariablesSingleDoublePageMode(true);
            if (bSetPageWidth) setGlobalVariablesPageWidth();
    if (bLoadPage) {
        imageMakeLeftVisible("#wrapper");            // the right one is always visible, just hidden because of the wrapper width
        setCSSScrollerSize("#wrapper", "#scroller", myScroll);
        _loadCurrentPage();
    }
        } else {
            myDebug("déjà en double page");
        }
    }
}
