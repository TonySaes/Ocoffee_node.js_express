export default {
    index: (req, res) => {
        res.render("shop", { title: "Présentation", cssFile: "shop.css" });
    }
}