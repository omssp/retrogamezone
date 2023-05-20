var audiotypes = {
    "mp3": "audio/mpeg",
    "mp4": "audio/mp4",
    "ogg": "audio/ogg",
    "wav": "audio/wav"
}

async function ss_soundbits(sound) {
    try {
        let res = await fetch(sound);
        let blob = await res.blob();
        sound = URL.createObjectURL(blob);
    } catch(error) {}

    var audio_element = document.createElement('audio')
    audio_element.setAttribute('preload', 'auto');
    if (audio_element.canPlayType) {
        for (var i = 0; i < arguments.length; i++) {
            var source_element = document.createElement('source')
            source_element.setAttribute('src', sound)
            if (sound.match(/\.(\w+)$/i))
                source_element.setAttribute('type', audiotypes[RegExp.$1])
            audio_element.appendChild(source_element)
        }
        audio_element.load()
        audio_element.playclip = function () {
            audio_element.pause()
            audio_element.volume = 0.5
            audio_element.currentTime = 0
            audio_element.play()
        }
        return audio_element
    }
}

ss_soundbits('//cdn.jsdelivr.net/gh/omssp/nesscraper/mario/smb_kick.wav')
    .then(audio => {
        window.moveAudio = audio;
    });
ss_soundbits('//cdn.jsdelivr.net/gh/omssp/nesscraper/mario/smb_stomp.wav', true)
    .then(audio => {
        window.selectAudio = audio;
    });
