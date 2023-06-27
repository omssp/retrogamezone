
class SaveHandler {

    validate_names = () => this.save_name_regex.test(this.save_name) && this.save_name_regex.test(this.game_slug);

    constructor(save_name) {
        this.baseURL = `/retrogamezone`;
        this.save_name_regex = /^(?=.{1,70}$)(?![_-])(?!.*[_-]{2})[a-zA-Z0-9-_]+(?<![_-])$/;
        this.game_slug = slugify(document.title).replaceAll(' ', '-');
        this.save_name = save_name;

        if (!this.validate_names())
            throw new Error('validation falied in game name or save name');

        this.base_link = `${this.baseURL}/${this.save_name}/${this.game_slug}`
        this.store_slug = `${this.save_name}--${this.game_slug}`

        this.mutex_flag = false
        this.make_urls()
    }

    make_urls = () => {
        this.put_url = `${this.base_link}/.json?print=silent`
        this.get_state_url = `${this.base_link}/state.json`
        this.get_time_url = `${this.base_link}/time.json`
    }

    set_slot = (save_slot) => {
        this.save_slot = save_slot;
        if (this.save_slot) {
            this.base_link += `/${this.save_slot}`;
            this.make_urls();
        }
    }

    beforeSend = () => {
        $('.b_save, #forceLoad').css('animation', 'pulse 1s infinite');
        this.mutex_flag = true;
    }

    complete = () => {
        $('.b_save, #forceLoad').css('animation', 'none');
        setTimeout(() => { this.mutex_flag = false; }, 2000);
    }

    saveToOnline = (state_obj) => {

        if (this.mutex_flag || !(state_obj && state_obj.state)) return;

        const data = {
            time: Date.now(),
            state: JSON.stringify([...pako.deflate(state_obj.state)])
        }

        setCookie(this.store_slug, data.time);

        $.ajax({
            type: 'PUT',
            url: this.put_url,
            data: JSON.stringify(data),
            context: this,
            beforeSend: this.beforeSend,
            complete: this.complete,
            success: function (resp) {
                console.log('saved online')
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
            }
        });
    }

    loadFromOnline = (e) => {

        if (this.mutex_flag || !window.EJS_loadState) return;

        $.ajax({
            type: 'GET',
            url: this.get_time_url,
            context: this,
            beforeSend: this.beforeSend,
            complete: this.complete,
            success: function (resp) {
                if (resp) {
                    let time = JSON.parse(resp);
                    if (time > getCookie(this.store_slug)) {
                        this.mutex_flag = false;
                        this.fetchStateAndLoad(this.store_slug, time);
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

        if (this.mutex_flag) return;

        $.ajax({
            type: 'GET',
            url: this.get_state_url,
            context: this,
            beforeSend: this.beforeSend,
            complete: this.complete,
            success: function (resp) {
                if (resp) {
                    window.EJS_loadState(pako.inflate(JSON.parse(resp)));
                    window.EJS_emulator.config.onsavestate = () => { };
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
