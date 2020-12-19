'use strict';

import { createFileOrFolder, updateVars, getVars, getfsFolderItems, getfs } from './fs.js';

new Vue({
	el: '#app',
	vuetify: new Vuetify({
		icons: {
			iconfont: 'mdi', // default - only for display purposes
		},
	}),
	data: {
		parentFolderPath: '',
		parentFolderName: null,
		parentId: null,
		name: '',
		childId: null,
		showDialog: false,
		type: 'Directory',
		currentDirectory: {},
		items: [],
		paths: []
	},
	methods: {
		create: function () {
			if (this.name) {
				// console.log('==create   this.currentDirectory===', { ...this.currentDirectory });
				// console.log(this.parentId, '===creating=====', this.childId);

				if (this.parentId === this.childId) {
					this.parentId = this.currentDirectory.parentId;
				}
				// console.log(this.parentId, '===after  creating=====', this.childId);
				const parent = createFileOrFolder({
					name: this.name,
					type: this.type.toLowerCase(),
					childId: this.childId,
					parentId: this.parentId,
					parentFolderName: this.parentFolderName,
					parentFolderPath: this.parentFolderPath
				});
				// console.log('===parent===', parent);
				this.name = '';
				this.showDialog = false;
				if (parent) {
					if (parent.childId) {
						this.childId = parent.childId;
						parent.parentId = parent.childId;
						this.updateValues(parent);
						this.showCurrentItems(parent.childId);
					} else {
						this.updateValues(parent);
						this.showCurrentItems(parent.parentId || 'root');
					}
				}
			} else {
				alert('Name can\'t be empty');
			}
		},

		open: function (item) {
			if (item.type === 'directory') {
				this.updateValues({
					parentFolderPath: `${this.currentDirectory.path}/${item.name}`,
					parentFolderName: item.name,
					parentId: this.parentId
				});
				this.getCurrentPath();
				if (item.childId) {
					this.childId = item.childId;
					this.updateParentId();
					this.showCurrentItems(item.childId);
				} else {
					this.childId = null;
					this.items = [];
				}
			}
		},

		getCurrentPath: function () {
			let paths = this.parentFolderPath.split('/');
			this.paths = paths.filter(Boolean)
				.map(name => {
					return {
						text: name
					};
				});
			return paths;
		},

		showCurrentItems: function (id) {
			this.currentDirectory = getfsFolderItems(id);
			this.items = this.currentDirectory.items;
		},

		updateValues: function (parent) {
			this.parentFolderPath = parent.parentFolderPath;
			this.parentFolderName = parent.parentFolderName;
			this.parentId = parent.parentId;
			updateVars({
				parentFolderPath: parent.parentFolderPath,
				parentFolderName: parent.parentFolderName,
				parentId: parent.parentId
			});
		},

		assignValues: function () {
			const vars = getVars();
			this.parentFolderPath = vars.parentFolderPath;
			this.parentFolderName = vars.parentFolderName;
			this.parentId = vars.parentId
		},

		goBack: function () {
			this.updateParentId();
			if (this.parentId) {
				// console.log('==goBack===this.parentId===', this.parentId);
				this.showCurrentItems(this.parentId);
				// console.log('==goBack===this.currentDirectory===', { ...this.currentDirectory });
				this.updateValues({
					parentFolderPath: this.currentDirectory.path,
					parentFolderName: this.paths[this.paths.length - 1].text,
					parentId: this.currentDirectory.parentId
				});
				this.getCurrentPath();
				this.updateChildId();
				this.updateParentId();

				// console.log('==goBack====parentFolderPath====', this.parentFolderPath);
				// console.log('===goBack===parentFolderName====', this.parentFolderName);
				// console.log('==goBack====parentId====', this.parentId);
			}
		},

		updateParentId: function () {
			for (let [key, value] of Object.entries(getfs())) {
				if (value.path === this.parentFolderPath.substr(0, this.parentFolderPath.lastIndexOf('/'))) {
					this.parentId = key;
				}
			}
		},

		updateChildId: function () {
			let flag = false;
			for (let [key, value] of Object.entries(getfs())) {
				if (value.path === this.parentFolderPath) {
					this.childId = key;
					flag = true;
					break;
				}
			}

			if (!flag) {
				this.childId = null;
			}
		},

		getFS: function () {
			console.log('===fs====', getfs());
		},

		getVars: function () {
			console.log('==vars parentFolderPath===', this.parentFolderPath);
			console.log('==vars parentFolderName===', this.parentFolderName);
			console.log('==vars parentId===', this.parentId);
			console.log('==vars childId===', this.childId);
			console.log('==this.currentDirectory===', { ...this.currentDirectory });
		}
	},
	mounted() {
		this.assignValues();
		const el = document.getElementById('vue-app');
		el.style.display = 'block';
	}
});
