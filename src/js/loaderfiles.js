import { utils } from './utils.js';

window.Library = {
	images: {},
    sounds: {},
    scenes: {},
	contents: {}
};

class LoaderFiles {
	constructor() {
		this.pathLoader = "dist/";
		this.imageSources = [];
		this.soundSources =  [];
		this.sceneSources = [];
		this.contentSources = [];
		this.onPreloaded = new CustomEvent('preloaded');
	}

	load(_progressCallback) {
		let _this = this;
		let totalAssets = this.imageSources.length + this.soundSources.length + this.sceneSources.length + this.contentSources.length;
		let assetsLoaded = 0;
		window.addEventListener('preloaded', () => {
			assetsLoaded++;
			_progressCallback(Math.round((100/totalAssets) * assetsLoaded));
		});
	
		return new Promise((resolve) => {
			let loadPromises = [];
			_this.imageSources.forEach(function(config){
				loadPromises.push(_this.loadImage(config));
			});
	
			_this.soundSources.forEach(function(config){
				loadPromises.push(_this.loadSound(config));
			});
	
			_this.sceneSources.forEach(function(config){
				loadPromises.push(_this.loadScene(config));
			});
	
			_this.contentSources.forEach(function(config){
				loadPromises.push(_this.loadContent(config));
			});
	
			Promise.all(loadPromises).then(resolve);
		});
	}

	addImages(imageConfigs) { 
		this.imageSources = this.imageSources.concat(imageConfigs);
	}

	loadImage(imageConfig) {
		let _this = this;
		return new Promise(function(resolve){
			fetch(imageConfig.src)
				.then(response => response.blob())
				.then(blobData => utils.createImageBitmap(blobData))
				.then(bitmap => {
					bitmap.hackSrc = imageConfig.src;
					Library.images[imageConfig.id] = bitmap;
					dispatchEvent(_this.onPreloaded);
					resolve();
				});
		});
	}

	addSounds(soundConfigs) {
		this.soundSources = this.soundSources.concat(soundConfigs);
	}

	loadSound(soundConfig) {
		let _this = this;
		return new Promise(function(resolve){
			let sound = new Howl({
				src: [soundConfig.src]
			});
			Library.sounds[soundConfig.id] = sound;
			sound.once("load",function(){
				dispatchEvent(_this.onPreloaded);
				resolve();
			});
		});
	}

	addScenes(sceneConfigs) {
		this.sceneSources = this.sceneSources.concat(sceneConfigs);
	}

	loadScene(sceneConfig) {
		let _this = this;
		return new Promise(function(resolve){
			let xhr = new XMLHttpRequest();
			xhr.open("GET", sceneConfig.src);
			xhr.onload = function() {
				if(xhr.status===200){
					Library.scenes[sceneConfig.id] = JSON.parse(xhr.responseText);
					dispatchEvent(_this.onPreloaded);
					resolve();
				}
			};
			xhr.send();
		});
	}


	addContents(contentConfigs) {
		this.contentSources = this.contentSources.concat(contentConfigs);
	}

	loadContent(contentConfig) {
		let _this = this;
		return new Promise(function(resolve){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", contentConfig.src);
			xhr.onload = function() {
				if(xhr.status===200){
					Library.contents[contentConfig.id] = xhr.response;
					dispatchEvent(_this.onPreloaded);
					resolve();
				}
			};
			xhr.send();
		});
	}
}

export { LoaderFiles };