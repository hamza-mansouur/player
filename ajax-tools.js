function print_r2(o){
    return JSON.stringify(o,null,'\t').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;');
}

var oErrorMessageDIV = null;
function printSysErrorMessage(data, transport, oPlaceholder) {
    var oMessage = /*$(*/'<div class="error-message">Une erreur est survenue. Merci de bien vouloir recommencer l\'opération. Si l\'erreur persiste merci de bien vouloir contacter le support technique. <!--Err:'+print_r2(data)+'-T:'+transport+'//--> </div>'/*)*/;
    //oPlaceholder.before(oMessage);
    if (oErrorMessageDIV == null) {
        var oBody = $("BODY");
        var sHTML = '<div id="dialog-message" style="display: none;"></div>';
        oErrorMessageDIV = $(sHTML);
        oErrorMessageDIV.attr("title", "Une erreur est survenue !");
        oBody.children().last().after(oErrorMessageDIV);
    }
    oErrorMessageDIV.html(oMessage);        // '<div class="error-message">Une erreur est survenue.</div>');

    $( "#dialog-message" ).dialog({
        modal: true,
        buttons: {
            Ok: function() {
                var that = $( this );
                that.dialog( "close" );
                setTimeout(function(oDialog){
                    oDialog.dialog("destroy");
                }, 0, that);
            }
        }
    });
}
function printAppErrorMessage(sError) {
    if (oErrorMessageDIV == null) {
        var oBody = $("BODY");
        var sHTML = '<div id="dialog-message" style="display: none;"></div>';
        oErrorMessageDIV = $(sHTML);
        oErrorMessageDIV.attr("title", "Une erreur est survenue !");
        oBody.children().last().after(oErrorMessageDIV);
    }
    oErrorMessageDIV.html(sError);

    $( "#dialog-message" ).dialog({
        modal: true,
        buttons: {
            Ok: function() {
                var that = $( this );
                that.dialog( "close" );
                setTimeout(function(oDialog){
                    oDialog.dialog("destroy");
                }, 0, that);
            }
        }
    });
}
function printSessionTimeout() {
    if (oErrorMessageDIV == null) {
        var oBody = $("BODY");
        var sHTML = '<div id="dialog-message" style="display: none;"></div>';
        oErrorMessageDIV = $(sHTML);
        oErrorMessageDIV.attr("title", "La session est tombée !");
        oBody.children().last().after(oErrorMessageDIV);
    }
    oErrorMessageDIV.html("vous allez être déconnecté");

    $( "#dialog-message" ).dialog({
        modal: true,
        buttons: {
            Ok: function() {
                var that = $( this );
                that.dialog( "close" );
                setTimeout(function(oDialog){
                    oDialog.dialog("destroy");
                    document.location = "/";
                }, 0, that);
            }
        }
    });
}

function insertWait(oPlaceholder) {
    myDebug("insert wait");
    // before() : If there is more than one target element, however, cloned copies of the inserted element will be created for each target except for the last one.
    // remove(sFilterSelector) : A selector expression that filters the set of matched elements to be removed.
    var oWait = $('<img class="wait" id="wait" src="css/icons/wait.gif"/>');
    myDebug(oWait);
    // contrairement à ce qui est dit je pense que cela crée une copie de l'objet au moment de l'insertion, donc cela ne sert à rien de conserver oWait
    oPlaceholder.before(oWait);
}
function removeWait(oPlaceholder) {
    myDebug("remove wait");
    var oItems = oPlaceholder.parent();
    console.log(oItems);
    oItems.find(".wait").remove();        // OK
}

