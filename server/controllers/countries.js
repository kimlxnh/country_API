const Country = require('../models/Country')
//for getting all countries
async function index(req, res){
    try {
        const countries = await Country .getAll()
        res.status(200).json(countries)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

async function show(req, res){
    try {
        let name = req.params.name
        const country = await Country.getOneByCountryName(name) //if everything's ok get a OK HTTP response
        res.status(200).json(country) //.json instead of .send so that its forced to send as json format
    }catch(err){
        res.status(404).json({error: err.message})
    }
}

async function create (req, res) {
    try {
        const data = req.body //all the names and population will be stored in the body
        const newCountry = await Country.create(data)
        res.status(201).json(newCountry)

    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

async function destroy (req, res){
    try { //check if country exists before deleting it
        const name = req.params.name
        const country = await Country.getOneByCountryName(name)
        const result = await country.destroy()
        res.status(204).end()
    }catch(err){ //.json instead of .send, use {} notation inside the ()
        res.status(404).json({error: err.message})
    }
}

const update = async (req, res) => {
    const name = req.params.name.toLowerCase()
    try {
        const country = await Country.getOneByCountryName(name)
        const updateCountry = await country.update(req.body)
        res.status(200).send(updateCountry)
    } catch (err) {
        res.status(404).send({error: err})
    }
}

module.exports = {index, show, create, destroy, update}