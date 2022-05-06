import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { domainToASCII } from "url";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }

    async signup(dto: AuthDto) {
        // generate the hash password
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                // Query only needed field 
                // ========================
                // select: {
                //     id: true,
                //     email: true,
                //     createAt: true,
                // }
                // ========================
            });

            // delete only hash field
            delete user.hash;

            // return the saved user
            return user;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;
        }
    }

    async signin(dto: AuthDto) {

        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        // if user does not exist throw exception
        if (!user) throw new ForbiddenException(
            'Credentials incorrect',
        );

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);


        // if password incorrect throw exception
        if (!pwMatches) throw new ForbiddenException(
            'Credentials incorrect',
        );

        delete user.hash

        // send back the user
        return user;
    }
}