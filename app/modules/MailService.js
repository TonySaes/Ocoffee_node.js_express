import emailjs from "@emailjs/nodejs";

/**
 * MailService
 * Service métier dédié à l'envoi de mails via EmailJS.
 * Utilise un style défensif pour garantir la qualité des entrées.
 */
export default class MailService {
  constructor(serviceId, templateId, apiKey) {
    if (!serviceId || !templateId || !apiKey) {
      throw new Error("MailService: Missing EmailJS configuration.");
    }

    this.serviceId = serviceId;
    this.templateId = templateId;
    this.apiKey = apiKey;
  }

  /**
   * Envoie un message de contact.
   * @param {Object} payload - Contenu provenant du formulaire.
   */
  async sendContactMessage(payload) {
    // Style défensif : validation d’entrée
    if (!payload || typeof payload !== "object") {
      throw new Error("MailService: Invalid payload.");
    }

    const { name, email, message } = payload;

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        { name, email, message },
        { publicKey: this.apiKey }
      );

      return {
        success: true,
        response
      };
    } catch (error) {
      console.error("MailService error:", error);
      throw new Error("MailService: Unable to send the message.");
    }
  }
}
