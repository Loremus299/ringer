const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Set environment variables\nPORT=\nin .env");
}

export default { port: PORT };
