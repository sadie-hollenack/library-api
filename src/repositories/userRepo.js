import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

/** DB support function for signup */
export async function createUser(data){
    return await prisma.user.create({data: data});
}

/** DB support function for login */
export async function findUserByEmail(username){
    return await prisma.user.findUnique({where: {username}});
}

export async function findUser(id){
    console.log(id);
    let user = await prisma.user.findUnique({where: {user_id: Number(id)}, omit: {password: true}});
    if(user !== null) {
      return user
    } else {
      const error = new Error('Cannot find a user with id of ' + id)
      error.status = 404
      throw error
    }
}

export async function findAllUsers(){
    return await prisma.user.findMany({omit: {password: true}});
}

export async function update(id, data){
    try {
    if(data.password){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
    }
    const updatedMe = await prisma.user.update({
      where: { user_id: Number(id) },
      data: data,
      omit: {password: true},
    });
    console.log(updatedMe);
    return updatedMe;
  } catch (error) {
    if (error.code === 'P2025'){
      const error = new Error('Cannot find a user with the id ' + id)
      error.status = 404
      throw error
    } 
    if(error.code === 'P2002'){
      console.log(2002)
      const error = new Error('Email has already been used');
      error.status = 409;
      throw error;
    }
    console.log("We hit an error" + error)
    throw error;
    
  }
}

export async function remove(id){
    try {
    await prisma.user.delete({
      where: { user_id: Number(id) },
    });
    return;
  } catch (error) {
    if (error.code === 'P2025') {
      const error = new Error('Cannot find a user with the id ' + id)
      error.status = 404
      throw error
    };
    throw error;
  }
}


export async function updateRole(id, role){
    try{
    const updatedUser = await prisma.user.update({
      where: { user_id: Number(id) },
      data: {role},
      omit: {password: true}
    });
    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') {
      const error = new Error('Cannot find a user with the id ' + id)
      error.status = 404
      throw error
    };
    throw error;
  }
}