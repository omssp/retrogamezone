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
            const setCache = (key, data) => env.RETROGZ.put(key, data)
            const getCache = key => env.RETROGZ.get(key)

            // const SUPPORTED_KEYS = ['', 'time', 'state']

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


            console.log(PATH, SLUG, method)

            if (method == "GET") {

                // if (SUPPORTED_KEYS.indexOf(KEY_NAME) < 0) throw "wrong key" 

                let data = JSON.parse(await getCache(SLUG))

                if (data && KEY_NAME) {
                    data = data[KEY_NAME] ? data[KEY_NAME] : null
                }

                return RETURN_JSON(data)
            } else if (method == "PUT") {

                const payload = await request.json()

                console.log(payload)

                await setCache(SLUG, JSON.stringify(payload))

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