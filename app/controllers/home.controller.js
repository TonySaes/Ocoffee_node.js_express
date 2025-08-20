export default {
    index : async (req, res) => {
        res.render("home", {  title: "Accueil" });
    }
}