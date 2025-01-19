
ZoteroOpenArchive = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],

	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},
	
	log(msg) {
		Zotero.debug("Zotero Open Archive: " + msg);
	},
	
	addToWindow(window) {
		let doc = window.document;
		
		// Use Fluent for localization
		window.MozXULElement.insertFTLIfNeeded("zotero-open-archive.ftl");
		
		// Add menu option
		let menuitem = doc.createXULElement('menuitem');
		menuitem.id = 'zotero-open-archive';
		menuitem.setAttribute('data-l10n-id', 'zotero-open-archive');
		menuitem.addEventListener('command', () => {
			ZoteroOpenArchive.openArchive();
		});
		doc.getElementById('menu_viewPopup').appendChild(menuitem);
		this.storeAddedElement(menuitem);
	},
	
	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},
	
	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="zotero-open-archive.ftl"]').remove();
	},
	
	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},
	
	openArchive() {
		var zp = Zotero.getActiveZoteroPane();
		item = zp.getSelectedItems()[0]
		// TODO: Allow setting to specify archive, archiveLocation, etc.
		archive = item.getField('archiveLocation');
		// TODO: Provide potential Windows drive mappings to search through.
		archive = archive.replaceAll("\"", "")
		if (archive.search(/[.]pdf$/i) != -1 ||
			archive.search(/[.]docx$/i) != -1 ||
		    archive.search(/[.]pptx$/i) != -1 ||
		    archive.search(/[.]doc$/i) != -1 ||
		    archive.search(/[.]odt$/i) != -1 ||
		    archive.search(/[.]ppt$/i) != -1 ||
			archive.search(/[.]odp$/i) != -1) {
			log('Opening ' + archive)
			Zotero.launchFile(archive)
		}
	},
	
	async main() {

		//patch(Zotero_LocateMenu, 'buildContextMenu', original => async function Zotero_LocateMenu_buildContextMenu(menu, _showIcons) {
		/*var original = Zotero.LocateMenu.buildContextMenu
		Zotero.LocateMenu.buildContextMenu = async function buildContextMenu(menu, _showIcons) {
			await original.apply(this, arguments) // eslint-disable-line prefer-rest-params

			try {
				var sibling
				for (const mi of menu.children) {
					if (mi.getAttribute('data-open-archive')) { // already in menu
						return
					}

					if (mi.getAttribute('data-l10n-id') === 'item-menu-addNote') { // zotero 7
						sibling = mi
					}

					if (mi.style?.listStyleImage === 'url("chrome://zotero/skin/treeitem-attachment-pdf.png")') { // zotero 6
						sibling = mi
					}
				}

				if (!sibling) {
					log('Error: sibling not found')
					return
				}

				const copyattr = (elt) => {
					for (const att of Array.from(sibling.attributes)) {
						if (att.nodeName.match(/^data-l10n-/)) continue
						elt.setAttribute(att.nodeName, att.nodeValue)
					}
				}
				const alternate = createElement('menuitem')
				copyattr(alternate)
				alternate.setAttribute('data-open-archive', 'true')

				//else { // existing Open option = internal
				log('adding external system opener: Open archived PDF (ext)')
				alternate.setAttribute('label', 'Open archived PDF (ext)')
				alternate.addEventListener('command', async event => { // eslint-disable-line @typescript-eslint/no-misused-promises
					event.stopPropagation()
					const items = ZoteroPane.getSelectedItems()
					for (const item of items) {
						//const attachment = item.isAttachment() ? item : (await item.getBestAttachment())
						const archive = item.getField('archive')
						log(`Have got archive: ${item.getField('archive')}`)
						//if (attachment?.attachmentPath.match(/[.]pdf$/i)) {
						if (archive.search(/[.]pdf$/i) != -1) {
							//Zotero.launchFile(attachment.getFilePath())
							Zotero.launchFile(archive)
						}
					}
				}, false)
				//}

				sibling.parentNode.insertBefore(alternate, sibling.nextSibling)


			}
			catch (err) {
				log(`failed to patch menu: ${err}`)
			}
		}
		//})*/
	},
};
