
var ZoteroOpenArchive;

function log(msg) {
	Zotero.debug("Zotero Open Archive: " + msg);
}

function install() {
	log("Installed Zotero Open Archive 2.0");
}

async function startup({ id, version, rootURI }) {
	log("Starting Zotero Open Archive 2.0");
	
	Zotero.PreferencePanes.register({
		pluginID: 'zotero-open-archive@atcwilliams.com.au',
		src: rootURI + 'preferences.xhtml',
		scripts: [rootURI + 'preferences.js']
	});
	
	Services.scriptloader.loadSubScript(rootURI + 'zotero-open-archive.js');
	ZoteroOpenArchive.init({ id, version, rootURI });
	ZoteroOpenArchive.addToAllWindows();
	await ZoteroOpenArchive.main();
}

function onMainWindowLoad({ window }) {
	ZoteroOpenArchive.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	ZoteroOpenArchive.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down Zotero Open Archive 2.0");
	ZoteroOpenArchive.removeFromAllWindows();
	ZoteroOpenArchive = undefined;
}

function uninstall() {
	log("Uninstalled Zotero Open Archive 2.0");
}
