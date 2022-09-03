const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require("@prisma/client");
const app = express(),
    port = 3080;

const prisma = new PrismaClient()

let documentsFromCSV;
let filePayload;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.options('*', cors())

function validatePhone(CSV){
    for (var i = 0; i < CSV.length; i++ ){
        var phone = CSV[i];

        if(phone.Telefone.toString().length === 11 && phone.Telefone.toString().charAt(2) === '9' && phone.Mensagem.length < 160){
            phone.Validez = true;
        } else{
            phone.Validez = false;
        }
    }

    return CSV;
}

//Get uploaded CSV File
app.use("/uploads/csv" , (req, res) => {

    documentsFromCSV = req.body.csv;
    
    filePayload = req.body.file;

    console.log(documentsFromCSV);

    console.log(validatePhone(documentsFromCSV));
    res.send("CSV Uploaded!");


});

//Sends JSON with CSV data to the client
app.get("/uploads/payload", (req, res) => {
    res.send(validatePhone(documentsFromCSV));
});

//Uploads date to MongoDb
app.use("/uploads/db", async function (req, res) {

        await prisma.$connect()

        const numerosTelefone = await prisma.numerosTelefone.createMany({
            data: documentsFromCSV,
        });

        const Arquivo = await prisma.arquivo.create({
            data: { NomeArquivo : filePayload },
        })

        res.send("Signal arrived!");
});


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});