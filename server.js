const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

let feedbacks = [];


app.get("/", (req,res)=>{

    res.sendFile(
        path.join(__dirname,
        "public",
        "index.html")
    );

});


app.post("/feedbacks/enviar",(req,res)=>{

    const {nome,comentario}=req.body;

    feedbacks.push({
        id:Date.now(),
        nome,
        comentario
    });

    res.redirect("/feedbacks/lista");

});


app.get("/feedbacks/lista",(req,res)=>{

    let pagina = fs.readFileSync(

        path.join(
            __dirname,
            "public",
            "lista.html"
        ),

        "utf8"

    );

    let lista = feedbacks
    .map(item=>`

    <div class="card">

        <h3>${item.nome}</h3>

        <p>${item.comentario}</p>

        <form
        action="/feedbacks/remover"
        method="POST">

            <input
            type="hidden"
            name="id"
            value="${item.id}"
            >

            <button>
            Remover
            </button>

        </form>

    </div>

    `)
    .join("");

    pagina=pagina.replace(

        "{{feedbacks}}",

        lista ||
        "<p>Nenhum feedback enviado.</p>"

    );

    res.send(pagina);

});

app.post("/feedbacks/remover",(req,res)=>{

    const id=
    Number(req.body.id);

    feedbacks=
    feedbacks.filter(
        item=>item.id!==id
    );

    res.redirect(
        "/feedbacks/lista"
    );

});


app.listen(3000,()=>{

console.log(
"Servidor rodando em http://localhost:3000"
)

});