// const fs = {
// 	"root": {
// 		"path": "home",
// 		"parentId": null,
// 		"items": [
// 			{
// 				"name": "first",
// 				"type": "directory",
// 				"childrenId": "ch1",
// 			},
// 			{
// 				"name": "test.pdf",
// 				"type": "file"
// 			}
// 		]
// 	},
// 	"ch1": {
// 		"path": "home/first",
// 		"parentId": "root",
// 		"items": [
// 			{
// 				"name": "anurag",
// 				"type": "directory",
// 				"childrenId": null
// 			},
// 			{
// 				"name": "new.png",
// 				"type": "file"
// 			}
// 		]
// 	}
// }

'use strict';

import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

const fs = {};

let isRootExists = false;
const parent = {
	parentFolderPath: '',
	parentFolderName: null,
	parentId: null
}

const isNameExists = (items, name) => {
	return !!items.find((item) => item.name === name);
};

const createRoot = ({ name, type }) => {
	fs['root'] = {
		path: 'home',
		parentId: null,
		items: [
			{
				name: name,
				type: type,
				...(type === 'directory' ? { childId: null } : false)
			}
		]
	};

	parent.parentId = 'root';
	parent.parentFolderPath = 'home';
	parent.parentFolderName = name;
	isRootExists = true;
	return;
}

const insertItemInRoot = ({ name, type }) => {
	if (isNameExists(fs['root'].items, name)) {
		return alert('Name already exists in the folder');
	}
	fs['root'].items.push({
		name: name,
		type: type,
		...(type === 'directory' ? { childId: null } : false)
	});
	return;
};

const updateParentChildId = ({ parentFolderName, parentId, childId }) => {
	for (let item of fs[parentId].items) {
		if (item.name === parentFolderName && item.type === 'directory') {
			item.childId = childId;
		}
	}
	return;
};

const createFileOrSubDirectory = ({ name, type, parentId, childId, parentFolderName, parentFolderPath: path }) => {
	let newChildId = childId;
	console.log(newChildId, '=========', parentId);
	if (fs[newChildId]) {
		if (isNameExists(fs[newChildId].items, name)) {
			alert('Name already exists in the folder');
			return null;
		}

		fs[newChildId].items.push({
			name: name,
			type: type,
			...(type === 'directory' ? { childId: null } : false)
		});
	} else {
		newChildId = nanoid();
		fs[newChildId] = {
			path: path,
			parentId: parentId,
			items: [
				{
					name: name,
					type: type,
					...(type === 'directory' ? { childId: null } : false)
				}
			]
		}

		updateParentChildId({ parentFolderName, parentId, childId: newChildId });
	}

	return { ...parent, childId: newChildId };
};

const createFileOrFolder = ({ name, type, parentId, childId, parentFolderName, parentFolderPath }) => {
	if (!isRootExists) {
		createRoot({ name, type });
		return { ...parent };
	}

	if (parentFolderPath === 'home') {
		insertItemInRoot({ name, type });
		return { ...parent };
	}

	return createFileOrSubDirectory({ name, type, parentId, childId, parentFolderName, parentFolderPath });
};

const getVars = () => {
	return { ...parent };
};

const updateVars = ({ parentFolderPath, parentFolderName, parentId }) => {
	parent.parentFolderPath = parentFolderPath;
	parent.parentFolderName = parentFolderName;
	parent.parentId = parentId;
};

const getfsFolderItems = (id) => {
	return fs[id];
};

const getfs = () => {
	return fs;
};

export {
	createFileOrFolder,
	getVars,
	updateVars,
	getfsFolderItems,
	getfs
};
