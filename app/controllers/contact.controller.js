export default {
  index: (req, res) => {
    res.render("contact", {title: "Contact", cssFile: "contact.css"});
  },
  sendMessage: (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Message from ${name} <${email}>: ${message}`);
    res.redirect("/contact?success=true");
  }
}