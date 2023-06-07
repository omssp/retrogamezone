
class SaveHandler {

    validate_names = () => this.save_name_regex.test(this.save_name) && this.save_name_regex.test(this.game_slug);

    constructor(save_name) {
        this.baseURL = `https://retrogz-default-rtdb.asia-southeast1.firebasedatabase.app/retrogamezone`;
        this.save_name_regex = /^(?=.{1,20}$)(?![_-])(?!.*[_-]{2})[a-zA-Z0-9-_]+(?<![_-])$/;
        this.game_slug = slugify(document.title).replaceAll(' ', '-');
        this.save_name = save_name;

        if (!this.validate_names())
            throw new Error('validation falied in game name or save name');

        this.put_url = `${this.baseURL}/${this.save_name}/${this.game_slug}.json?print=silent`
        this.get_url = `${this.baseURL}/${this.save_name}/${this.game_slug}/state.json`

    }

    saveToOnline = (state_obj) => {

        if (!(state_obj && state_obj.state))
            return;

        const data = {
            time: Date.now(),
            state: JSON.stringify([...state_obj.state])
        }

        $.ajax({
            type: 'PUT',
            url: this.put_url,
            data: JSON.stringify(data),
            success: function (resp) {
                console.log('saved online')
            }
        });
    }

    loadFromOnline = (e) => {
        // console.log(e)
        if (!window.EJS_loadState)
            return;
        $.ajax({
            type: 'GET',
            url: this.get_url,
            success: function (resp) {
                if (resp) {
                    console.log('saved state found')
                    window.EJS_loadState(new Uint8Array(JSON.parse(resp)))
                } else {
                    console.error('no saved state found')
                }
            }
        });
    }

}
