const { Router } = require("express");
const Products = require("../models/Products");
const router = Router();
const multer = require("multer");
const { body, validationResult } = require("express-validator")

const image_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/products/")
    },

    filename: function (req, file, cb) {
        const image_filename = Date.now() + file.originalname.split(" ").join("-");
        cb(null, `${image_filename}`);
    }
})

const upload = multer({ storage: image_storage });

router.get("/products", async (req, res) => {
    res.render("products")
})

router.get("/products/add", upload.single("image"), async (req, res) => {
    res.render("pages/add-product")
})

router.get("/products/:id", async (req, res) => {
    res.render("product-id");
})

router.post("/products/add", upload.single("image"), 



    [
        body("nameuz").isEmpty().isLength({min: 3, max: 150}).withMessage("Iltimos nomini kiritng (uz) "),
        body("nameru").isEmpty().isLength({min: 3, max: 150}).withMessage("Iltimos nomini kiritng (ru) "),
        body("nameen").isEmpty().isLength({min: 3, max: 150}).withMessage("Iltimos nomini kiritng (en) ")
    ],

    async (req, res) => {

        let errors = validationResult(req);

        let handleError = !errors.isEmpty();

        if(handleError) {
            res.render("pages/add-product", { errors: errors.errors })
        }

        console.log({ body: req.body });
        const { nameuz, nameru, nameen, fullTextuz, fullTextru, fullTexten, price } = req.body
        const product = new Products({
            name: { uz: nameuz, ru: nameru, en: nameen },
            image: req.file,
            fulltext: { uz: fullTextuz, ru: fullTextru, en: fullTexten },
            price: price
        })

        console.log(product);

        product.save((err) => {
            if (err)
                console.log(err);
            else
            res.redirect("/")
        })
    })


module.exports = router