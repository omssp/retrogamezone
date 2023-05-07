function load() {
    let arg = parent.document.getElementById('gameName').innerHTML;
    $('option:selected', 'select[name="options"]').removeAttr('selected');
    let foundrom = $('select[name="options"]').find('option[value="' + arg + '"]')
    if (!foundrom.length) {
        console.log(foundrom.length)
        setTimeout(load, 100);
        return;
    }
    foundrom.attr("selected", true);
    $('select[name="options"]').change();
}
var pauseStatus = false;

function togglePause() {
    if (pauseStatus == false) {
        $('#pauseb').click();
        $('#ppbutton').fadeOut(100, function () {
            $('#ppbutton').attr('src', 'controls/play.png');
        }).fadeIn(100);
        pauseStatus = true;
    } else {
        $('#pauseb').click();
        $('#ppbutton').fadeOut(100, function () {
            $('#ppbutton').attr('src', 'controls/pause.png');
        }).fadeIn(100);
        pauseStatus = false;
    }
    window.pauseAudio.playclip();
}

ss_soundbits('//cdn.jsdelivr.net/gh/omssp/nesscraper/mario/smb_coin.wav', true)
    .then(audio => {
        window.pauseAudio = audio;
    });
ss_soundbits('//cdn.jsdelivr.net/gh/omssp/nesscraper/mario/smb_breakblock.wav', true)
    .then(audio => {
        window.resetAudio = audio;
    });
ss_soundbits('//cdn.jsdelivr.net/gh/omssp/nesscraper/mario/smb_bump.wav', true)
    .then(audio => {
        window.muteAudio = audio;
    });

var muteStatus = false;

function toggleAudio() {
    if (muteStatus == false) {
        $('#muteb').click();
        $('#mubutton').fadeOut(100, function () {
            $('#mubutton').attr('src', 'controls/unmute.png');
        }).fadeIn(100);
        muteStatus = true;
    } else {
        $('#muteb').click();
        $('#mubutton').fadeOut(100, function () {
            $('#mubutton').attr('src', 'controls/mute.png');
        }).fadeIn(100);
        muteStatus = false;
    }
    window.muteAudio.playclip();
}

var cur = "url('controls/zoom-out.ico'), auto";
var stretchMode = true;

function toggleStretchMode() {
    stretchMode = !stretchMode;
    fullScreenCanvasHandler();
}

$("body").keydown(function (e) {
    parent.$('.infoDiv.mob').fadeOut(1000);
    //alert(e.keyCode);
    if (e.keyCode == 32) {
        $("#ppbutton").click();
        return false;
    }
    if (e.keyCode == 82) {
        $("#powbutton").click();
        return false;
    }
    if ((e.keyCode == 8) ||
        (e.keyCode == 38 && (e.altKey || e.shiftKey))) {
        parent.document.getElementById('homeButton').click();
        return false;
    }
    if ((e.keyCode == 78 && (e.altKey || e.shiftKey)) ||
        (e.keyCode == 39 && (e.altKey || e.shiftKey))) {
        parent.document.getElementById('nextGame').click();
        return false;
    }
    if ((e.keyCode == 80 && (e.altKey || e.shiftKey)) ||
        (e.keyCode == 37 && (e.altKey || e.shiftKey))) {
        parent.document.getElementById('previousGame').click();
        return false;
    }
    if (e.keyCode == 80) {
        parent.keybPrimaryPlayer.toggle();
        return false;
    }
    if (e.keyCode == 77 || e.keyCode == 173) {
        $("#mubutton").click();
        return false;
    }
    if (e.keyCode == 90) {
        toggleStretchMode();
        return false;
    }
});

function togglePower() {
    $("#powerb").click();
    $('#ppbutton').fadeOut(100, function () {
        $('#ppbutton').attr('src', 'controls/pause.png');
    }).fadeIn(100);
    pauseStatus = false;
    window.resetAudio.playclip();
}

function onnescanvasclick() {
    // alert(IsFullScreenCurrently())
    if (IsFullScreenCurrently()) {
        return
    }
    document.getElementById("zoomb").click();
    if (cur == "url('controls/zoom-out.ico'), auto") {
        window.parent.document.getElementById('gameFrame').style.transition = "all 0.9s";
        cur = "url('controls/zoom-in.ico'), auto";
        window.parent.document.getElementById('gameFrame').style.height = "366px";
        window.parent.document.getElementById('gameFrame').style.marginTop = "45px";
        $('#addedCSS').text('#powbutton, #ppbutton, #mubutton {width:70px!important; height:70px!important;} .nes-status {width: 256px!important; text-align: center;}');
    } else {
        window.parent.document.getElementById('gameFrame').style.transition = "all 0.5s";
        cur = "url('controls/zoom-out.ico'), auto";
        window.parent.document.getElementById('gameFrame').style.height = "693px";
        window.parent.document.getElementById('gameFrame').style.marginTop = "15px";
        $('#addedCSS').text('#powbutton, #ppbutton, #mubutton {width:150px!important; height:150px!important;} .nes-status {width: 512px!important; text-align: right;}');
    }
    $(this).css('cursor', cur);
}

function setCursor() {
    document.getElementById("zoomb").click();
    $('head').append('<style id="addedCSS" type="text/css">#powbutton, #ppbutton, #mubutton {width:150px!important; height:150px!important;} .nes-status {width: 512px!important; text-align: right;}</style>');
    $('#nescanvas').on("click", onnescanvasclick);
    $('#nescanvas').hover(function () {
        $(this).css('cursor', cur);
    });
}