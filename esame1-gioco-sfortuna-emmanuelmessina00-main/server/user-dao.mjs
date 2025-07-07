import { db } from "./database.mjs";
import crypto from "crypto";


export default function UserDao() {
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    const user = { id: row.id, username: row.username, email: row.email};
                    resolve(user);
                }
            });
        });
    };

    this.getUserByCredentials = (email, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Users WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id, username: row.username, email: row.email};

                    
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) 
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

}