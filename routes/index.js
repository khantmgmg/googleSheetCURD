const express = require("express");
const router = express.Router();
const sheetsController = require("../controllers/sheetsController");

router.get("/", sheetsController.index);
router.get("/create", sheetsController.create);
router.post("/create", sheetsController.store);
router.get("/edit/:id", sheetsController.edit);
router.put("/update/:id", sheetsController.update);
router.delete("/delete/:id", sheetsController.destroy);

module.exports = router;
