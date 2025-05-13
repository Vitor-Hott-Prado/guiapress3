const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

// Rota para exibir o formulário de criação de nova categoria
router.get("/admin/categories/new",(req, res) => {
    res.render("admin/categories/new");
});




module.exports = router;
// Rota para salvar uma nova categoria
router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined){
        // Cria uma nova categoria com título e slug
        Category.create({
            title: title,
            slug: slugify(title) // Converte o título em um slug (URL amigável)
        }).then(() => {
            res.redirect("/");
        })

    }else{
        res.redirect("/admin/categories/new");
        
    }
});

// Rota para listar todas as categorias
router.get("/admin/categories",  (req, res) => {
    Category.findAll({
        order: [['id', 'ASC']]
    }).then(categories => {
        // Adiciona um ID sequencial para cada categoria
        const categoriesWithSequentialId = categories.map((category, index) => {
            return {
                ...category.toJSON(),
                sequentialId: index + 1
            };
        });
        res.render("admin/categories/index", {categories: categoriesWithSequentialId});
    }).catch(err => {
        console.log("Erro ao listar categorias: ", err);
        res.redirect("/");
    });
});

// Rota para exibir o formulário de edição de uma categoria específica
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    
    // Verifica se o ID é um número válido
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    // Busca a categoria pelo ID
    Category.findByPk(id).then(category => {
        if(category != undefined){
            // Se encontrou a categoria, renderiza a página de edição
            res.render("admin/categories/edit", {category: category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Rota para salvar as alterações de uma categoria
router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    // Verifica se o título não está vazio
    if(title == undefined || title == ""){
        res.redirect("/admin/categories");
        return;
    }

    // Atualiza a categoria com o novo título e slug
    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Rota para deletar uma categoria
router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined && !isNaN(id)){
        if(!isNaN(id)){
            // Remove a categoria do banco de dados
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{// Se o ID não for um número
            res.redirect("/admin/categories");
        }
    }else{ // Se o ID for nulo
        res.redirect("/admin/categories");
    }
});

module.exports = router;