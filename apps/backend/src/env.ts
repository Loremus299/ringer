const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

if (!(PORT && DATABASE)) {
	throw new Error("Set environment variables\nPORT=\nDATABASE=\nin .env");
}

export default { port: PORT, database: DATABASE };
