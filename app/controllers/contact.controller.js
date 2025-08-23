import sendEmail from "../modules/emailjsForContact.js";

export default {
  index: (req, res) => {
    const { okMessage } = req.query;
    const { errorMessage } = req.query;
    res.render("contact", {title: "Contact", cssFile: "form.css", okMessage, errorMessage});
  },

  sendMessage: async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        const errorMessage = encodeURIComponent("Tous les champs sont requis.");
        return res.redirect(`/contact?errorMessage=${errorMessage}`);
    }
    
    try {
        await sendEmail(name, email, message);
        const okMessage = encodeURIComponent(`Merci ${name}, votre message a bien été envoyé ! Vous serez contacté par email à l'adresse ${email}.`);
        res.redirect(`/contact?okMessage=${okMessage}`);
    } catch (error) {
    const errorMessage = encodeURIComponent("Une erreur est survenue lors de l'envoi de l'email.");
    res.redirect(`/contact?errorMessage=${errorMessage}`);
    }
  }
}