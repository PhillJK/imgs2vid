export default async function (metaUrl) {
	const { fileURLToPath } = await import("url");
	const { dirname } = await import("path");

	const __filename = fileURLToPath(metaUrl);
	const __dirname = dirname(__filename);

	return { __dirname, __filename };
}
