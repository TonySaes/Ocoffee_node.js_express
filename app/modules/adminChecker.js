export default function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  const errorMessage = encodeURIComponent("Accès réservé aux administrateurs.");
  return res.redirect(`/admin/login?errorMessage=${errorMessage}`);
}
