const STATIC = 'staticv1';
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';

//Guardar en cache desde un inicio
const APP_SHELL = [
    '/',
    '/index.html',
    'js/app.js',
    'img/osos.png',
    'css/styles.css',
    'img/stitch.jpg',
    '/pages/offline.html'
]
const APP_SHELL_INMUTABLE = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
]

self.addEventListener("install", (e) =>{
    console.log("Instalado");
    //abrir un cache que ya existe o abrir uno nuevo
    const staticCache = caches.open(STATIC) 
    .then(cache =>{
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE)
    .then(cache =>{
        cache.addAll(APP_SHELL_INMUTABLE)
    });
    
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
    //e.skipWaiting();
});

self.addEventListener("activate", (e) =>{
    console.log("Activado");
});

/*Por medio de estrategias de cache y fetch, mostrar la página offline cuando no tengamos internet*/ 

self.addEventListener("fetch", (e) =>{
    const source = fetch(e.request).then((res) =>{
        if (res) {
            caches.open(STATIC).then(cache =>{
                cache.put(e.request, res)
            })
            return res.clone();
        }else{
            throw Error('NOT-FOUND')
        }
    }).catch((error) =>{
        return caches.match('/pages/offline.html')
    });
    e.respondWith(source);
});

    //5. Cache and network race. El recurso que se cargué más rápido en cache o internet se va a devolver primero.
    //5. Cache and network race
    /*const source = new Promise((resolve,reject)=>{
        let flag = false;
        const failsOnce = () =>{
            if(flag){
                //Si falló una vez aquí poner la lógica para controlarlos
                if(/\.(png|jpg)/i.test(e.request.url)){
                    resolve(caches.match("/img/not-found.png"));
                }else{
                    reject("SourceNotFound");
                }
            }else{
                flag = true;
            }
        };
        fetch(e.request).then(resFetch=>{
            resFetch.ok ? resolve(resFetch) : failsOnce();
        }).catch(failsOnce);
        caches.match(e.request).then(sourceCache =>{
            sourceCache.ok ? resolve(sourceCache) : failsOnce();
        }).cache(failsOnce);
    });
    e.respondWith(source);


    //4. Cache with network update
    //Cuando nuestro equipo sea de bajo rendimiento. Desventaja: siempre se queda un paso atrás
    //Después actualiza el recurso
    //Rendimiento critico. Siempre se queda un paso atrás
    /*const source = caches.open(STATIC).then(cache =>{
        fetch(e.request).then(resFetch=>{
            cache.put(e.request,resFetch);
        });
        return cache.match(e.request);
    })

    e.respondWith(source);
*/

    //3. Network with cache fallback primero se checa en internet y luego en cache. Fallback significa:
    /*const source = fetch(e.request)
    .then(res =>{
        if (!res) throw Error("NotFound");
        //guardarlo en cache
        caches.open(DYNAMIC).then(cache =>{
            cache.put(e.request, res);
        });
        return res.clone();
    }).catch(err =>{
        return caches.match(e.request);
    })
    e.respondWith(source);*/



    //2. Cache with network fallback si no lo encontramos en el cache vamos al internet
    /*const source = caches.match(e.request)
    .then(res =>{
        if (res) return res;
        //si no existe lo trae desde internet
        return fetch(e.request).then(restFetch =>{
            caches.open(DYNAMIC).then(cache =>{
                cache.put(e.request, restFetch);
            });
            return restFetch.clone();
        });
    });
    e.respondWith(source);*/
    //1. Cache Only
    //e.respondWith(caches.match(e.request)); //solo trae recursos que ya están definidos


//console.log("SW: Hola");
//console.log("adios");