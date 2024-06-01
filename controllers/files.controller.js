const { file } = require('../models')
const fs = require("fs")

let self = {}

// GET: api/files
self.getAll = async function (req, res) {
    try {
        let data = await file.findAll({ attributes: ['fileId', 'mime', 'indb', 'name', 'size'] })
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// GET: api/files/5/details
self.getDetalils = async function (req, res) {
    try {
        let id = req.params.fileId
        let data = await file.findByPk(id, { attributes: ['fileId', 'mime', 'indb', 'name', 'size'] })
        if (data)
            return res.status(200).json(data)
        else
            return res.status(404).send()
    } catch (error) {
        return res.status(500).json(error)
    }
}

// GET: api/files/5
self.get = async function (req, res) {
    try {
        let id = req.params.fileId
        let data = await file.findByPk(id)
        if (!data)
            return res.status(404).send()

        let image = data.data
        if (!data.indb)
            image = fs.readFileSync("uploads/" + data.name)

        return res.status(200).contentType(data.mime).send(image);

    } catch (error) {
        return res.status(500).json(error)
    }
}

// POST: api/files
self.create = async function (req, res) {
    try {
        if (req.file == undefined) return res.status(400).json('El archivo es obligatorio.');

        let binary = null;
        let indb = false;
        if (process.env.FILES_IN_BD == "true") {
            binary = fs.readFileSync("uploads/" + req.file.filename)
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            indb = true;
        }

        // Crea el registro
        let data = await file.create({
            mime: req.file.mimetype,
            indb: indb,
            name: req.file.filename,
            size: req.file.size,
            data: binary
        })

        //Envia la respuesta
        return res.status(201).json({
            fileId: data.fileId,
            mime: req.file.mimetype,
            indb: indb,
            name: req.file.filename
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

// PUT: api/files/5
self.update = async function (req, res) {
    try {
        if (req.file == undefined) return res.status(400).json('El archivo es obligatorio.');

        let id = req.params.fileId
        let image = await file.findByPk(id)
        if (!image) {
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            return res.status(404).send()
        }

        let binary = null;
        let indb = false;
        if (process.env.FILES_IN_BD == "true") {
            binary = fs.readFileSync("uploads/" + req.file.filename)
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            indb = true;
        }
        

        let data = await file.update({
            mime: req.file.mimetype,
            indb: indb,
            name: req.file.filename,
            size: req.file.size,
            data: binary
        }, { where: { fileId: id } })


        //Envia la respuesta
        if (data[0] === 0)
            return res.status(404).send()

        // Eliminamos el archivo anterior
        if (!image.indb)
            fs.existsSync("uploads/" + image.name) && fs.unlinkSync("uploads/" + image.name)

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json(error)
    }
}

// DELETE: api/files/5
self.delete = async function (req, res) {
    try {
        const id = req.params.fileId
        let image = await file.findByPk(id)

        if (!image)
            return res.status(404).send()

        let data = await file.destroy({ where: { fileId: id } })

        if (data === 1) {
            // Eliminamos el archivo anterior            
            if (!image.indb)
                fs.existsSync("uploads/" + image.name) && fs.unlinkSync("uploads/" + image.name)
            return res.status(204).send()
        }
        return res.status(404).send()
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = self