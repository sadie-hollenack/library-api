//import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

/** DB support function for signup */
export async function createUser(data){
    return await prisma.user.create({data: data, omit: {password: true}});
}

/** DB support function for login */
export async function findUserByEmail(email){
    return await prisma.user.findUnique({where: {email}});
}

export async function findUser(id){
    console.log(id);
    return await prisma.user.findUnique({where: {id}, omit: {password: true}});
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
      where: { id },
      data: data,
      omit: {password: true}
    });
    return updatedMe;
  } catch (error) {
    if (error.code === 'P2025') return null;
    if(error.code === 'P2002'){
         const error = new Error('Email has already been used');
                error.status = 409;
                throw error;
    }
    throw error;
    
  }
}

export async function remove(id){
    try {
    await prisma.user.delete({
      where: { id },
    });
    return;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}


export async function updateRole(id, role){
    try{
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {role},
      omit: {password: true}
    });
    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}