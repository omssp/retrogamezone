class KeyboardPrimaryPlayer {

    playersSwapped = false;

    toggle = () => {
        this.change(!this.playersSwapped);
        
    }

    resetSwapped = () => {
        this.change(false);
    }

    setSwapped = () => {
        this.change(true);
    }

    change = (to) => {
        this.playersSwapped = to;
        let controllers = $('.controllers');
        let titles = $('#controls th');
        if (this.playersSwapped) {
            controllers[0].src = "//cdn.jsdelivr.net/gh/omssp/nesscraper/images/controller1s.png";
            titles[1].innerHTML = "Player 2";
            controllers[1].src = "//cdn.jsdelivr.net/gh/omssp/nesscraper/images/controller2s.png";
            titles[2].innerHTML = "Player 1";
            $('#gamepadicon').css('color', 'rgb(244, 67, 54)');
        } else {
            controllers[0].src = "//cdn.jsdelivr.net/gh/omssp/nesscraper/images/controller1.png";
            titles[1].innerHTML = "Player 1";
            controllers[1].src = "//cdn.jsdelivr.net/gh/omssp/nesscraper/images/controller2.png";
            titles[2].innerHTML = "Player 2";
            $('#gamepadicon').css('color', 'rgb(57 73 171)');

        }
        try {
            window.moveAudio.playclip();
        } catch (error) { }
    }

}