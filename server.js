const express = require('express')
const data = require('./data/joyas.js')
const { hateoas_v1, hateoas_v2, filter_fields, orderBy } = require('./helpers.js')
const app = express()
app.listen(3000, () => console.log('Your app listening on port 3000'))


const joyas = data.results

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('Oh wow! this is working =)')
})

//V1
app.get('/api/v1/joyas', (req, res) => {
    res.send(hateoas_v1(joyas))
})

app.get('/api/v1/joyas/:id', (req, res) => {
    const joya = joyas.find(j => j.id === parseInt(req.params.id))
    if (!joya) return res.status(404).send('The joya with the given ID was not found')
    if (fields) {
        const filteredJoya = filter_fields(joya, fields.split(','))
        res.send(filteredJoya)
    } else {
        res.send(joya)
    }
})

//V2
app.get('/api/v2/joyas', (req, res) => {
    const { order, page } = req.query
    if (!(order || page)) {
        console.log("page and order doesn't exist");
        return res.status(400).send(hateoas_v2(joyas))
    } else {
        if (order && page) {
            console.log('page and order exist');
            const lista_joyas_order = orderBy(joyas, 'value', order)
            const lista_joyas_page = lista_joyas_order.slice(page * 2 - 2, page * 2)
            if (lista_joyas_page.length === 0) return res.status(404).send('The joyas with the given page was not found')
            res.send(hateoas_v2(lista_joyas_page))
        } else {
            if (page) {
                console.log('page');
                const lista_joyas_page = joyas.slice(page * 2 - 2, page * 2)
                if (lista_joyas_page.length === 0) return res.status(404).send('The joyas with the given page was not found')
                res.send(hateoas_v2(lista_joyas_page))
            }
            if (order) {
                console.log('order');
                const lista_joyas_order = orderBy(joyas, 'value', order)
                res.send(hateoas_v2(lista_joyas_order))
            }
        }

    }
})

app.get('/api/v2/joyas/:id', (req, res) => {
    const joya = joyas.find(j => j.id === parseInt(req.params.id))
    if (!joya) return res.status(404).send('The joya with the given ID was not found')
    const { fields } = req.query
    if (fields) {
        const filteredJoya = filter_fields(joya, fields.split(','))
        res.send(filteredJoya)
    } else {
        res.send(joya)
    }
})

app.get('/api/v2/joyas/categoria/:categoria', (req, res) => {
    const joyas_categoria = joyas.filter(j => j.category === req.params.categoria)
    if (!joyas_categoria) return res.status(404).send('The joyas with the given category was not found')
    res.send(joyas_categoria)
});