import { getAllUsers, getUser, updateUser, deleteUser, updateUserRole } from "../services/userService.js";

export async function getAllUsersHandler(req, res){
    const users = await getAllUsers();
    return res.status(200).json(users);
}

export async function getUserByIDHandler(req, res){
    const id = req.params.id;
    console.log(id);
    const me = await getUser(id);
    return res.status(200).json(me);
}

export async function updateUserHandler(req, res){
    const id = req.params.id;
      const updates = {};
      if (req.body.username) updates.username = req.body.username;
      if (req.body.password) updates.password = req.body.password;
    
      const updatedMe = await updateUser(id, updates);
      console.log(updatedMe);
      return res.status(200).json(updatedMe);
}

export async function deleteUserHandler(req, res){
    const id = req.params.id;
    await deleteUser(id);
    return res.status(204).json();
}

export async function updateUserRoleHandler(req, res){
    let id = parseInt(req.params.id);
    let role = req.body.role;
    const updatedUserRole = await updateUserRole(id, role);
    if(!updatedUserRole){
        return res.status(404).json();
    }
    return res.status(200).json(updatedUserRole);
}