import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        username: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        createdAt: {
            type: Date,
            createdAt: true,
        }
    }
});