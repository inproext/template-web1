/* SCORM */
class Scorm {
	constructor() {
		this.scorm = pipwerks.SCORM;
		this.position = 1;
		this.totalSlides = 0;
		this.config = null;
	}

	initScorm () {
		this.scorm.version = '1.2';
		this.callSucceeded = this.scorm.init();
		if(this.callSucceeded){
			if(this.scorm.get('cmi.core.entry') != 'ab-initio') {
				let sd = this.scorm.get('cmi.suspend_data');
				this.config = sd != '' ? JSON.parse(sd) : this.config;
				this.position = parseInt(this.scorm.get('cmi.core.lesson_location')) || 1;
			}
		}
	}

	saveScorm() {
		let percentage = 0;
		percentage = Math.round(100 / this.totalSlides * this.position);
		this.scorm.set('cmi.core.lesson_location', this.position);
		this.scorm.set('cmi.suspend_data', JSON.stringify(this.config));
		this.scorm.set('cmi.core.score.raw', percentage);

		if(this.position == this.totalSlides) {
			this.scorm.set('cmi.core.lesson_status', 'completed');
		}
		else {
			this.scorm.set('cmi.core.lesson_status', 'incomplete');
		}
		this.scorm.save();
	}

	endCourse () {
		this.scorm.set('cmi.core.lesson_location', 1);
		this.scorm.set('cmi.core.lesson_status', 'passed');
		this.scorm.quit(); 
		this.scorm.set('cmi.core.exit', 'logout'); 
		alert('Muy bien. Has terminado el módulo. No olvides cerrar la ventana del curso');
	}
}

export { Scorm }