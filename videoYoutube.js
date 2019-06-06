    function startVideo() {
        myDebug("startVideo");
        if (bYoutubePlayerInCreation) {
            console.log('destroy');
        } else if (oYoutubePlayer == null) {
            console.log('create');
            createYoutubePlayer();
        } else {
            console.log('destroy');
        }
    }
    function stopVideo() {
        myDebug("stopVideo");
        if (bYoutubePlayerInCreation) {
            console.log('destroy');
        } else if (oYoutubePlayer == null) {
            console.log('create');
        } else {
            console.log('destroy');
            oYoutubePlayer.stopVideo();
        }
    }
    function killVideo() {
        myDebug("killVideo");
        if (bYoutubePlayerInCreation) {
            console.log('destroy');
            destroyYoutubePlayer();
        } else if (oYoutubePlayer == null) {
            console.log('create');
        } else {
            console.log('destroy');
            destroyYoutubePlayer();
        }
    }
    /*function _loopVideo1(){ myDebug("loop video1"); stopVideo(); killVideo(); setTimeout(_loopVideo2, 1000); }
    function _loopVideo2(){ myDebug("loop video2"); startVideo(); setTimeout(_loopVideo1, 2000); }
    function loopVideo() {
        _loopVideo1();
    }*/

    var oYoutubePlayer = null;
    var bYoutubeAPILoaded = false;
    var bYoutubePlayerInCreation = false;
    function toggleVideo() {
        console.log('toggle');
        if (bYoutubePlayerInCreation) {
            console.log('destroy');
            destroyYoutubePlayer();
        } else if (oYoutubePlayer == null) {
            console.log('create');
            createYoutubePlayer();
        } else {
            console.log('destroy');
            destroyYoutubePlayer();
        }
    }
        
    function destroyYoutubePlayer() {
        console.log('destroyYoutubePlayer');
        if (bYoutubePlayerInCreation) {
            console.log('delaying destroy');
            setTimeout(destroyYoutubePlayer, 1000);
        } else if (oYoutubePlayer != null) {
            console.log('destroying');
            oYoutubePlayer.stopVideo();
            oYoutubePlayer.destroy();
            oYoutubePlayer = null;
        } else {
            console.log('nothing to destroy');
        }
    }
    function onYouTubeIframeAPIReady() {
        console.log('api ready');
        _createYoutubePlayer();
    }
    function createYoutubePlayer() {
        console.log('createYoutubePlayer');
        if (!bYoutubeAPILoaded) {
            console.log('load api');
            bYoutubePlayerInCreation = true;
            bYoutubeAPILoaded = true;
            // 2. This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            console.log('api already loaded');
            bYoutubePlayerInCreation = true;
            _createYoutubePlayer();
        }
    }
    function _createYoutubePlayer() {
         console.log('_createYoutubePlayer');
        
        var oContainer = $("#youtubePlaceholder");
        
        var quadri = oContainer.attr("quadri");
        var dateParution = oContainer.attr("dateParution");
        var articleId = oContainer.attr("articleId");
        var videoId = oContainer.attr("videoId");
        var sVideoName = oContainer.attr("videoName");
        analyticsViewVideo(quadri, dateParution, articleId, videoId, sVideoName);
        
        var sVideoURL = oContainer.attr("sVideoURL");
        oYoutubePlayer = new YT.Player('youtubePlaceholder', {
            height: '360',
            width: '640',
            videoId: sVideoURL,//'M7lc1UVf-VE',
            events: {
                'onReady': onYoutubePlayerReady//,
                //'onStateChange': onPlayerStateChange
            }
        });
    }
    function onYoutubePlayerReady(event) {
         console.log('onYoutubePlayerReady2');
        bYoutubePlayerInCreation = false;
        //event.target.playVideo();
    }
