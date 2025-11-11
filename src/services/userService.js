import { findAllUsers, findUser, update, remove, updateRole } from "../repositories/userRepo.js";

export async function getAllUsers() {
    return await findAllUsers();
}

export async function getUser(id){
    return await findUser(id);
}

export async function updateUser(id, data){
    return await update(id, data);
}

export async function deleteUser(id){
    return await remove(id)
}

export async function updateUserRole(id, role){
    return await updateRole(id, role);
}