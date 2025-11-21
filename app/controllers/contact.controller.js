import MailService from "../modules/MailService.js";

const mailService = new MailService(
  process.env.EMAILJS_SERVICE_ID,
  process.env.EMAILJS_TEMPLATE_ID,
  process.env.EMAILJS_PUBLIC_KEY
);

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
      const result = await mailService.sendContactMessage(req.body);
      const okMessage = encodeURIComponent(`Merci ${name}, votre message a bien été envoyé ! Vous serez contacté par email à l'adresse ${email}.`);

      res.redirect(`/contact?okMessage=${okMessage}`);
    } catch (error) {
      const errorMessage = encodeURIComponent("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.");
      res.redirect(`/contact?errorMessage=${errorMessage}`);
    }
  },
};