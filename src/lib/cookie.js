function setCookie(cname, cvalue, exdays) {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem(cname, JSON.stringify(cvalue));
    } else {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
}

function getCookie(cname) {
    let return_value = null
    if (typeof (Storage) !== "undefined") {
        return_value = JSON.parse(localStorage.getItem(cname));
    }
    if (!return_value) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    }
    return return_value;
}