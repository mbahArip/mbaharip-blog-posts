<%*  
const title = await tp.system.prompt("Enter post title:", "", true);

if(!title) return;

const type = ["Articles", "Projects"];  
const postFolder = app.vault.getAbstractFileByPath("posts/articles");  
const workFolder = app.vault.getAbstractFileByPath("posts/projects");  
const typeFolder = [ postFolder, workFolder ];  
const folder = await tp.system.suggester(type, typeFolder)

if(!folder) return;
console.log(folder)
const timestamp = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");  
const date = tp.date.now("YYYY-MM-DD_HH-mm-ss");

let name = title.trim().replace(/[^a-zA-Z0-9 ]/g, '').replaceAll(' ', '-').toLowerCase();  
const filePath = tp.obsidian.normalizePath(`${folder.path}/${name}.md`)

if(await tp.file.exists(filePath)) {
	new Notice("File already exists!", 8000).noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${folder.name} with the same name already exist!`
	return;
}

await tp.file.create_new("", name, true, folder);

tp.hooks.on_all_templates_executed(async () => {
	const file = tp.file.find_tfile(tp.file.path(true));
	await app.fileManager.processFrontMatter(file, (frontmatter) => {
		frontmatter['title'] = title.charAt(0).toUpperCase() + title.slice(1).trim();
		frontmatter['slug'] = name;
		frontmatter['summary'] = '';
		frontmatter['thumbnail'] = '';
		frontmatter['thumbnail_x'] = '0.5';
		frontmatter['thumbnail_y'] = '0.5';
		frontmatter['tags'] = [];
		frontmatter['created_at'] = timestamp;
		frontmatter['updated_at'] = timestamp;
		if(folder === workFolder) {
			frontmatter['repository'] = '';
			frontmatter['demo'] = '';
		}
	})
})
%>