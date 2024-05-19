class SaveHandler {

    validate_names = () => this.save_name_regex.test(this.save_name) && this.save_name_regex.test(this.game_slug);

    constructor(save_name) {
        this.baseURL = `/retrogamezone`;
        this.save_name_regex = /^(?=[a-zA-Z0-9-_]{1,70}$)(?![_-])(?!.*[_-]{2})([a-zA-Z0-9-_]*[a-zA-Z0-9])$/;
        this.game_slug = slugify(document.title).replaceAll(' ', '-');
        this.save_name = save_name;

        if (!this.validate_names())
            throw new Error('validation falied in game name or save name');

        this.og_base = `${this.baseURL}/${this.save_name}/${this.game_slug}`
        this.base_link = this.og_base
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
        if (Number.isInteger(this.save_slot) && this.save_slot >= 0) {
            this.base_link = `${this.og_base}/${this.save_slot}`;
            this.make_urls();
        }
    }

    beforeSend = (svld) => {
        svld?.css('animation', 'pulse 1s infinite');
        this.mutex_flag = true;
    }

    complete = () => {
        window.b_save.css('animation', 'none');
        window.b_load.css('animation', 'none');
        setTimeout(() => { this.mutex_flag = false; }, 2000);
    }

    saveToOnline = (state_obj) => {

        if (this.mutex_flag || !(state_obj && state_obj.state)) return;

        const data = {
            time: Date.now(),
            state: JSON.stringify([...pako.deflate(state_obj.state)])
        }

        $.ajax({
            type: 'PUT',
            url: this.put_url,
            data: JSON.stringify(data),
            context: this,
            beforeSend: () => { this.beforeSend(window.b_save); },
            complete: this.complete,
            success: function (resp) {
                console.log('saved online')
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                window.b_save.effect('shake');
            }
        });
    }

    loadFromOnline = (e) => {

        if (this.mutex_flag) return;

        $.ajax({
            type: 'GET',
            url: this.get_time_url,
            context: this,
            beforeSend: () => { this.beforeSend(window.b_load); },
            complete: this.complete,
            success: function (resp) {
                if (resp) {
                    let time = JSON.parse(resp);
                    if (time > getCookie(this.store_slug)) {
                        this.mutex_flag = false;
                        this.fetchStateAndLoad();
                        console.log('saved time fetched : new state available')
                        return;
                    }
                }
                console.log('no saved time found')
                window.load_state()
                console.log('saved time fetched : no new state')
                if (navigator.vibrate) navigator.vibrate([100, 50, 50]);
            },
            error: () => { window.load_state(); }
        });
    }

    fetchStateAndLoad = () => {

        if (this.mutex_flag) return;

        $.ajax({
            type: 'GET',
            url: this.get_state_url,
            context: this,
            beforeSend: () => { this.beforeSend(window.b_load); },
            complete: this.complete,
            success: function (resp) {
                if (resp) {
                    window.load_state(pako.inflate(JSON.parse(resp)));
                    window.save_local();
                    window.cloud_message('CLOUD : Load successful')
                    console.log('saved state fetched and loaded')
                    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                    window.b_load.effect('shake');
                } else {
                    console.log('no saved state found')
                }
            }
        });
    }
}
