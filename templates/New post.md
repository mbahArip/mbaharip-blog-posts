<%*
// Ask for a title and cancel if it's empty
const title = await tp.system.prompt("Enter post title:", true);
if(!title) return;

// Ask for post type
const articlesFolder = app.vault.getAbstractFileByPath("posts/articles");
const projectsFolder = app.vault.getAbstractFileByPath("posts/projects");
const typeName = ["Articles", "Projects"];
const typeValue = [articlesFolder, projectsFolder];

const folder = await tp.system.suggester(typeName, typeValue);
if(!folder) return;

// Basic metadata
const slug = title.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').replace(/\s/g, '-').toLowerCase();
const timestamp = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");

// Check if already exists
const filePath = tp.obsidian.normalizePath(`${folder.path}/${slug}.md`);
if(await tp.file.exists(filePath)) {
	new Notice("",8000).noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${folder.name} with the same title already exists.`;
	return;
}

// Create the file
await tp.file.create_new("", slug, true, folder);

// Insert metadata after creating the file
tp.hooks.on_all_templates_executed(async () => {
	const file = tp.file.find_tfile(tp.file.path(true));
	await app.fileManager.processFrontMatter(file, (fm) => {
		fm.title = title.charAt(0).toUpperCase() + title.slice(1).trim();
		fm.slug = slug;
		fm.summary = '';
		fm.thumbnail = '';
		fm.thumbnail_x = '';
		fm.thumbnail_y = '';
		fm.tags = [];
		fm.created_at = timestamp;
		fm.updated_at = timestamp;
		
		if(folder === projectsFolder) {
			fm.repository = '';
			fm.demo = '';
		}
	})
})
%>
