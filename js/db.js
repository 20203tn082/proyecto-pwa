//Primer parametro: nombre base de datos
//Segundo parametro: versión
//Crea la base de datos
let req = window.indexedDB.open('pwadb', 1);

//Si se necesita actualizar haremos lo siguiente.

req.onupgradeneeded = (e) =>{
    console.log("DB updated");
    let db = e.target.result;
    //crear como una tabla
    db.createObjectStore('users',{
        keyPath: 'id',
    });
};

req.onerror = (e) =>{
    console.log('DB - Error ->', e.target.error);
};

//Ya establecimos una conexión
req.onsuccess = (e) =>{
    let db = e.target.result;
    //nombre de la tabla
    //modo en que va a leer o interactuar con nuestra tabla
    let transaction = db.transaction('users','readwrite');
    transaction.onerror = (e) =>{
        console.log('TR - Error ->' , e.target.error);
    };

    //para cuando la transacción se complete

    transaction.oncomplete = (e) =>{
        console.log('TR - Done -> ', e);
    };
    //Conseguir nuestra tabla
    let stored = transaction.objectStore('users');
    stored.add({
        //toda la información del objeto
        id: new Date().toISOString(),
        username: "Nath",
        fullname: 'Nathaly Escalona'
    });

    //si lo hizo correctamente
    stored.onsuccess = (e) =>{
        console.log('ST - Success ->', 'Agregado correctamente');
    };
};