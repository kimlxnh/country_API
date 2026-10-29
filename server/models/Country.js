const db = require('../db/connect')

class Country {
    constructor ({country_id, name, capital, population, languages, fun_fact, map_image_url}){
        this.country_id=country_id
        this.name=name
        this.capital=capital
        this.population=population
        this.languages=languages
        this.fun_fact=fun_fact
        this.map_image_url=map_image_url
    } //to get all countries so static
    static async getAll(){
        const response = await db.query('SELECT * FROM country;')
        if (response.rows.length===0){
            throw new Error ('No countries available')
        }
        return response.rows.map(c => new Country(c))
    }
    static async getOneByCountryName(countryName){
        const response = await db.query('SELECT * FROM country WHERE LOWER(name) = LOWER($1);',
            [countryName]
        )
        if (response.rows.length!=1){
            throw new Error ('Unable to locate country')
        } 
        return new Country (response.rows[0])
    }
    static async create(data) { //static is used for putting it or using ALL the data
        const { name, capital, population, languages} = data //check country doesn't already exist
        const existingCountry = await db.query('SELECT name FROM country WHERE LOWER(name) = LOWER($1);',
            [name]
        ) //if doesn't exist, insert into the country and return all
        if (existingCountry.rows.length === 0){
            let response = await db.query('INSERT INTO country (name, capital, population, languages) VALUES ($1, $2, $3, $4) RETURNING *;', //comma needed
               [name, capital, population, languages] ) //pass values in an array, avoids immediate SQL injection
               return new Country(response.rows[0])
        } else {
            throw new Error('A country with this name already exists.')
        }
    } //destroy does not require static
    async destroy (){
        let response = await db.query('DELETE FROM country WHERE name = $1 RETURNING *;',
            [this.name])
            return new Country(response.rows[0])
    }//for patch and update, $ are parameter placeholders
    async update(data){
        const name = data.name || this.name
        const capital = data.capital || this.capital
        const population = data.population || this.population
        const languages = data.languages || this.languages
        //country_id fixed $5, referred to as this.country_id
        const response = await db.query('UPDATE country SET name = $1, capital = $2, population = $3, languages = $4 WHERE country_id = $5 RETURNING *;',
        [name, capital, population, languages, this.country_id])
        return new Country(response.rows[0])
    }
}

module.exports = Country
