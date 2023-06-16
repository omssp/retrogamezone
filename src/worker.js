// String.prototype['chunk'] = function (n) {
//     var ret = [];
//     for (var i = 0, len = this.length; i < len; i += n) {
//         ret.push(this.substr(i, n));
//     }
//     return ret;
// };

const config = {
    "storage_provider": 'upstash',
    "supported_keys": ['', 'time', 'state']
}


const saveHandler = {};

saveHandler.storage_cfkv = class storage_cfkv {
    constructor(env) {
        this.env = env
    }

    saveKV = (key, data) => this.env.RETROGZ.put(key, data)

    getKV = key => this.env.RETROGZ.get(key)
}

saveHandler.storage_upstash = class storage_upstash {
    constructor(env) {
        this.env = env
        this.upstash_url = env.UPSTASH_URL
    }

    requestOptions = (command) => ({
        "method": 'POST',
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "Authorization": `Bearer ${this.env.UPSTASH_TOKEN}`
        },
        "body": JSON.stringify(command),
        "redirect": 'follow'
    })

    
    executeCommand = async (command) => {
        const resp = await fetch(this.upstash_url, this.requestOptions(command))
        const json = await resp.json()
        return json.error ? JSON.stringify(json.error) : json.result
    }

    saveKV = (key, data) => this.executeCommand(["SET", key, data])

    getKV = key => this.executeCommand(["GET", key])
}

export default {
    async fetch(request, env, ctx) {
        const DEFAULT_HEADERS = {
            "content-type": "application/json;charset=UTF-8",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, PUT'
        }
        const RETURN_JSON = (data) => new Response(JSON.stringify(data, null, 4), {
            headers: DEFAULT_HEADERS,
        })

        try {
            const storage_handler = new saveHandler[`storage_${config.storage_provider}`](env);

            const { method } = request

            const URLOBJ = new URL(request.url)
            const PRINT = URLOBJ.searchParams.get('print')
            const FILE_NAME = URLOBJ.pathname.replace(/^.*[\\\/]/, '')

            if (!FILE_NAME.endsWith('.json')) throw "json not asked"

            const PATH = URLOBJ.pathname.split('/')

            if (PATH[1] != 'retrogamezone') throw "not supported"


            PATH.splice(1, 1)

            const SLUG = PATH.join('/').replace(FILE_NAME, '').replace(/^\/+|\/+$/g, '').replace(/\//g, '-')
            const KEY_NAME = FILE_NAME.replace('.json', '')

            // if (config.supported_keys.indexOf(KEY_NAME) < 0) throw "wrong key" 

            console.log(PATH, SLUG, method)

            if (method == "GET") {

                let data = JSON.parse(await storage_handler.getKV(SLUG))

                if (data && KEY_NAME) {
                    data = data[KEY_NAME] ? data[KEY_NAME] : null
                }

                return RETURN_JSON(data)
            } else if (method == "PUT") {

                const payload = await request.json()

                let data = payload

                if (KEY_NAME) {
                    data = JSON.parse(await storage_handler.getKV(SLUG))
                    data = data ? data : {}
                    data[KEY_NAME] = payload
                }

                await storage_handler.saveKV(SLUG, JSON.stringify(data))

                if (PRINT == 'silent') {
                    return new Response("", { headers: DEFAULT_HEADERS, status: 204 })
                }
                return RETURN_JSON(payload)
            }

            return RETURN_JSON(null)
        } catch (error) {
            // return new Response(error.message + "" + error.stack)
            return RETURN_JSON(null)
        }
    },
};