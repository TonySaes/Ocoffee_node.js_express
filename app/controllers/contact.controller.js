export default {
  index: (req, res) => {
    const { okMessage } = req.query;
    const { errorMessage } = req.query;
    res.render("contact", {title: "Contact", cssFile: "contact.css", okMessage, errorMessage});
  },
  sendMessage: (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        const errorMessage = encodeURIComponent("Tous les champs sont requis.");
        return res.redirect(`/contact?errorMessage=${errorMessage}`);
    }
    const okMessage = encodeURIComponent(`Merci ${name}, votre message a bien été envoyé ! Vous serez contacté par email à l'adresse ${email}.`);
    res.redirect(`/contact?okMessage=${okMessage}`);
  }
}