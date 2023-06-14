
class SaveHandler {

    validate_names = () => this.save_name_regex.test(this.save_name) && this.save_name_regex.test(this.game_slug);

    constructor(save_name) {
        // this.baseURL = `https://saver.omssp.workers.dev/retrogamezone`;
        this.baseURL = `https://retrogz-default-rtdb.asia-southeast1.firebasedatabase.app/retrogamezone`;
        this.save_name_regex = /^(?=.{1,20}$)(?![_-])(?!.*[_-]{2})[a-zA-Z0-9-_]+(?<![_-])$/;
        this.game_slug = slugify(document.title).replaceAll(' ', '-');
        this.save_name = save_name;

        if (!this.validate_names())
            throw new Error('validation falied in game name or save name');

        this.base_link = `${this.baseURL}/${this.save_name}/${this.game_slug}`
        this.put_url = `${this.base_link}/.json?print=silent`
        this.get_state_url = `${this.base_link}/state.json`
        this.get_time_url = `${this.base_link}/time.json`

        this.store_slug = `${this.save_name}-${this.game_slug}`
    }

    saveToOnline = (state_obj) => {

        if (!(state_obj && state_obj.state))
            return;

        const data = {
            time: Date.now(),
            state: JSON.stringify([...pako.deflate(state_obj.state)])
        }

        setCookie(this.store_slug, data.time);

        $.ajax({
            type: 'PUT',
            url: this.put_url,
            data: JSON.stringify(data),
            beforeSend: (a) => {
                $('#header .inner').css('animation', 'pulse 1s infinite');
            },
            complete: (a) => {
                $('#header .inner').css('animation', 'none');
            },
            success: function (resp) {
                console.log('saved online')
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
            }
        });
    }

    loadFromOnline = (e) => {
        // console.log(e)
        if (!window.EJS_loadState)
            return;

        const save = [this.fetchStateAndLoad, `${this.store_slug}`]

        $.ajax({
            type: 'GET',
            url: this.get_time_url,
            beforeSend: (a) => {
                $('#header .inner').css('animation', 'pulse 1s infinite');
            },
            complete: (a) => {
                $('#header .inner').css('animation', 'none');
            },
            success: function (resp) {
                if (resp) {
                    let time = JSON.parse(resp);
                    if (time > getCookie(save[1])) {
                        save[0](save[1], time);
                        console.log('saved time fetched : new state available')
                    } else {
                        window.load_state()
                        console.log('saved time fetched : no new state')
                        if (navigator.vibrate) navigator.vibrate([100, 50, 50]);
                    }
                } else {
                    console.log('no saved time found')
                }
            }
        });
    }

    fetchStateAndLoad = (slug, time) => {
        $.ajax({
            type: 'GET',
            url: this.get_state_url,
            beforeSend: (a) => {
                $('#header .inner').css('animation', 'pulse 1s infinite');
            },
            complete: (a) => {
                $('#header .inner').css('animation', 'none');
            },
            success: function (resp) {
                if (resp) {
                    window.EJS_loadState(pako.inflate(JSON.parse(resp)));
                    window.EJS_emulator.config.onsavestate = () => {};
                    window.save_state();
                    setCookie(slug, time);
                    setTimeout(() => {
                        window.EJS_emulator.config.onsavestate = (e) => window.saver.saveToOnline(e);
                    }, 500);
                    console.log('saved state fetched and loaded')
                    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                } else {
                    console.log('no saved state found')
                }
            }
        });
    }
}
