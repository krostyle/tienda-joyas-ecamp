const e = require('express');
const { results: joyas } = require('./data/joyas.js');

const hateoas_v1 = (lista_joyas) => {
    const joyas_v1 = lista_joyas.map((joya) => {
        return {
            name: joya.name,
            href: `localhost:3000/api/v1/joyas/${joya.id}`
        }
    });
    return {
        count: joyas_v1.length,
        results: joyas_v1
    };
}


const hateoas_v2 = (lista_joyas) => {
    const joyas_v2 = lista_joyas.map((joya) => {
        return {
            nombre: joya.name,
            url: `localhost:3000/api/v2/joyas/${joya.id}`
        }
    });
    return {
        cantidad: joyas_v2.length,
        resultados: joyas_v2
    };
}


const filter_fields = (joya, fields) => {
    let new_joya = {};
    for (const property in joya) {
        if (fields.includes(property)) {
            new_joya[property] = joya[property];
        }
    }
    return new_joya;
}

const orderBy = (joyas, field, order) => {
    return joyas.sort((a, b) => {
        if (order === 'asc') {
            return a[field] - b[field];
        } else {
            return b[field] - a[field];
        }
    });
}


module.exports = {
    hateoas_v1,
    hateoas_v2,
    filter_fields,
    orderBy
}