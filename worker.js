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

    saveKV = async (key, data, subkey) => {
        let store = data
        if (subkey) {
            store = await this.getKV(key, '')
            store = store ? store : {}
            store[subkey] = data
        }
        return await this.env.RETROGZ.put(key, JSON.stringify(store))
    }

    getKV = async (key, subkey) => {
        const data = JSON.parse(await this.env.RETROGZ.get(key))
        return subkey ? data[subkey] ? data[subkey] : null : data
    }
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
        const resp = await fetch(this.upstash_url, this.requestOptions(command.filter(o => o)))
        const json = await resp.json()
        return json.error ? JSON.stringify([json.error]) : json.result
    }

    saveKV = (key, data, subkey) => this.executeCommand(["JSON.SET", key, subkey ? `$.${subkey}` : '$', JSON.stringify(data)])

    getKV = async (key, subkey) => {
        const data = JSON.parse(await this.executeCommand(["JSON.GET", key, subkey ? `$.${subkey}` : '$']))
        return data ? data.length? data[0] : null : null
    }
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

            const SLUG = PATH.join('/').replace(FILE_NAME, '').replace(/^\/+|\/+$/g, '').replace(/\//g, '--')
            const KEY_NAME = FILE_NAME.replace('.json', '')

            // if (config.supported_keys.indexOf(KEY_NAME) < 0) throw "wrong key" 

            // console.log(PATH, SLUG, method, KEY_NAME)

            if (method == "GET") {
                let data = await storage_handler.getKV(SLUG, KEY_NAME)
                return RETURN_JSON(data)
            } else if (method == "PUT") {

                const PAYLOAD = await request.json()

                await storage_handler.saveKV(SLUG, PAYLOAD, KEY_NAME)

                if (PRINT == 'silent')
                    return new Response("", { headers: DEFAULT_HEADERS, status: 204 })
                return RETURN_JSON(PAYLOAD)
            }

            return RETURN_JSON(null)
        } catch (error) {
            // return new Response(error.message + "" + error.stack)
            return RETURN_JSON(null)
        }
    },
};