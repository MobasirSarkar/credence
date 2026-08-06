import Database from 'better-sqlite3';
const db = new Database('./data/lms.db');
const user = db.prepare("SELECT * FROM users WHERE email = ?").get('mobasir@gmail.com');
console.log(user);
