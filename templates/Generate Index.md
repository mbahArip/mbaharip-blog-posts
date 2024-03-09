<%*
const path = require('path');
const fs = require('fs/promises');
const {exec} = require('child_process');

const toast = new Notice("Generating index...", 8000);

try {
	const script = path.resolve("E:", "Cloud", "OneDrive", "Documents", "ObsidianVaults", "portfolio", "scripts", "index.ts");
	const exist = await fs.stat(script);

	const run = exec("npm run start", {
		cwd: "E:/Cloud/OneDrive/Documents/ObsidianVaults/portfolio"
	}, (err, stdout, stderr) => {
		if(err) throw new Error(err);
		console.log(stdout);
		toast.setMessage("Index generated! You can push the file now.");
	})
	
} catch(error) {
	toast.setMessage(`Error: ${error.message}`);
	console.error(error)
}
%>