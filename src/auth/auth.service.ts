import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){

    }

    signin() {
        return {msg: 'I\'ve signed in'}
    }
    
    signup() {
        return {msg: 'I\'ve signed up'}
    }
}