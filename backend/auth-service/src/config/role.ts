import { Role } from "@prisma/client";

const allRoles = {
    [Role.USER]: "USER",
    [Role.ADMIN]: "ADMIN"
};

export { allRoles };

