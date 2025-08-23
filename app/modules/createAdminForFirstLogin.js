import usersModels from "../models/users.models.js";

export default async function createAdminUser () {
    const currentUser = process.env.ADMIN_USER;
    const currentPwd = process.env.ADMIN_PASSWORD;

    if (!currentUser || !currentPwd) {
        const error = new Error("ADMIN_USER et ADMIN_PASSWORD doivent être définis dans les variables d'environnement.");
        console.error(error.message);
        return error;
    }

    const exist = await usersModels.getUserByName(currentUser);
    if (!exist) {
        await usersModels.createUser({ username: currentUser, password: currentPwd, is_admin: true });
        console.log(`Utilisateur admin créé avec le nom d'utilisateur : ${currentUser}`);
    }
    return;
}