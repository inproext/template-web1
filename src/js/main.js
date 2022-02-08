import { LoaderFiles } from './loaderfiles.js';
import { Scorm } from './scorm.js';
import { utils } from './utils';

const preload = new LoaderFiles();
const scorm = new Scorm();

let bd = document.body;
let btnCloseMain = document.querySelector('.btn-close-main');
let btnsNav = document.querySelectorAll('.btn-nav');
let layerMain = document.getElementById('LayerMain');
let layerContent = document.getElementById('LayerContent');
let layerIntro = document.getElementById('LayerIntro');
let layerPreload = document.getElementById('LayerPreload');
let layerMenu = document.getElementById('LayerMenu');
let btnStart = document.querySelector('.btn-start');
let btnItemsMenu = document.querySelectorAll('.btn-item-menu');
let itemMenus = document.querySelectorAll('.item-menu');
let basePage = { width: 1920, height: 1080, scale: 1, pixelRatio: 0.5625 }
let lastPosition = 0;
let currentPosition = 1;
let cantSlides = 27; 

let totalThemes = itemMenus.length;
let animationOrientation = '',
    currentSlide = '',
    lastSlide = '';

preload.addContents([
	{ id: '1', src: 'dist/html/1.html' },
    { id: '2', src: 'dist/html/2.html' },
    { id: '3', src: 'dist/html/3.html' }
]);

preload.addImages([
    { id: 'logo', src : 'dist/img/interfaz/logo.png' },
    { id: 'intro', src: 'dist/img/interfaz/intro.png' },
    { id: 'btn-start', src: 'dist/img/interfaz/btn-start.png' },
    { id: 'arrow', src: 'dist/img/interfaz/arrow.svg' },
    { id: 'bg-menu', src: 'dist/img/interfaz/bg-menu.png' },
    { id: 'icono-menu', src: 'dist/img/interfaz/icono-menu.png' },
    { id: 'tema1', src: 'dist/img/tema1.png' },
    { id: 'tema2', src: 'dist/img/tema2.png' },
    { id: 'tema3', src: 'dist/img/tema3.png' },
    { id: 'foto1', src: 'dist/img/foto1.png' },
    { id: 'foto2', src: 'dist/img/foto2.png' },
    { id: 'foto3', src: 'dist/img/foto3.png' },
    { id: 'foto4', src: 'dist/img/foto4.png' },
    { id: 'foto5', src: 'dist/img/foto5.png' },
    { id: 'foto6', src: 'dist/img/foto6.png' },
    { id: 'foto7', src: 'dist/img/foto7.png' },
    { id: 'foto8', src: 'dist/img/foto8.png' },
    { id: 'franja1', src: 'dist/img/franja1.png' },
    { id: 'ilustracion1', src: 'dist/img/ilustracion1.png' }
]);

preload.addSounds([

]);


preload.load(function (_progress) {
	layerPreload.innerHTML = '<h1>'+_progress + '%</h1>';
}).then(function () {
    let divStart = document.createElement('div');
    divStart.innerText = "Comenzar";
    divStart.addEventListener('click', function() { 
        /*openFullscreen();*/ 
        layerPreload.style.display = 'none'; 
        layerIntro.remove();
        /*
        document.querySelectorAll('.container-menu video').forEach((_el) => {
            _el.play();
        });
        */
    });
    layerPreload.appendChild(divStart);
    scorm.initScorm();
    init();
});


function init() {
    currentPosition = scorm.position;
    scorm.totalSlides = cantSlides;
    scorm.config = scorm.config == null ? [0,0,0,0] : scorm.config;
    setEvents();
    utils.loadImages();
    //fn_load();
    // fn_resize();
}

function fn_load(_id){
    let animation  = parseInt(bd.getAttribute('data-position')) <= _id + 1 ? 'fadeIn' : 'fadeIn';
    layerContent.innerHTML = '';
    layerContent.innerHTML = Library.contents[_id];
    utils.loadImages();
    utils.parseScript(Library.contents[_id]);
    // utils.animateCss('.container-main', animation);
    scorm.position = currentPosition;
    bd.setAttribute('data-position', _id);
    scorm.saveScorm();
    document.getElementById('LayerContent').scrollTop = 0;
}

function setEvents() {
    let prevTime = new Date().getTime();
    let mc = new Hammer(layerMenu);
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    mc.on('panleft panright panup pandown tap press', function(ev) {
        let curTime = new Date().getTime();
        let timeDiff = curTime-prevTime;
        prevTime = curTime;
        if(timeDiff > 200) {
            if(ev.type == "panleft"){
                animationOrientation = 'right';
                fn_navSlide();
            }

            if(ev.type == "panright"){
                animationOrientation = 'left';
                fn_navSlide();
            }
        }
    });
    
    Hamster(layerMenu).wheel(function(event, delta, deltaX, deltaY){
        let curTime = new Date().getTime();
        let timeDiff = curTime-prevTime;
        prevTime = curTime;
         if(timeDiff > 200) {
            if(delta == -1){
                animationOrientation = 'right';
            }
            else {
                animationOrientation = 'left';
            }
            fn_navSlide();
        }
    });
    
    btnStart.addEventListener('click', function() {
        // layerIntro.classList.add('animate__fadeOutDown');
        layerIntro.remove();
        //fn_load();
    });

    bd.addEventListener('click', function(e) {
        if(e.target.classList.contains('btn-html'))
        {
            currentPosition = parseInt(e.target.getAttribute('data-html')) - 1;
        }
        if(e.target.classList.contains('btn-finish'))
        {
            scorm.endCourse();
        }
    });

    btnsNav.forEach((_el) => {
        _el.addEventListener('click', function() {
            if(this.classList.contains('btn-nav-next')){
                animationOrientation = 'right';
            }
            else{
                animationOrientation = 'left';
            }
            fn_navSlide();
        });
    });

    btnItemsMenu.forEach((_el) => {
        _el.addEventListener('click', function() {
            let html = parseInt(this.getAttribute('data-html'));
            document.body.classList.add('expand');
            if(window.innerWidth < 768 && (window.innerHeight > window.innerWidth))
            {
                anime({
                    targets: layerMain,
                    right: ['-100vw', '0vw'],
                    easing: 'linear',
                    duration: 600,
                    begin: function(anim) {
                        layerMain.style.display = 'block';
                        fn_load(html);
                    },
                    complete: function(anim) {
                        // layerHtml.innerHTML = window.Library.contents[html];
                    }
                });
            }
            else {
                
                anime({
                    targets: layerMenu,
                    width: ['100vw', '35vw'],
                    easing: 'linear',
                    duration: 600,
                    begin: function(anim) { }
                });
                
                anime({
                    targets: layerMain,
                    right: ['-65vw', '0vw'],
                    easing: 'linear',
                    duration: 600,
                    begin: function(anim) {
                        layerMain.style.display = 'block';
                        fn_load(html);
                    },
                    complete: function(anim) {
                        // layerHtml.innerHTML = window.Library.contents[html];
                    }
                });
            }
           
        });
    });

    btnCloseMain.addEventListener('click', function(){
        document.body.classList.remove('expand');
        if(window.innerWidth < 768 && (window.innerHeight > window.innerWidth))
        {
            anime({
                targets: layerMain,
                right: ['0vw', '-100vw'],
                easing: 'linear',
                duration: 600,
                begin: function(anim) {
                    layerMain.style.display = 'block';
                    document.getElementById('LayerContent').scrollTop = 0;
                },
                complete: function(anim) {
                    layerContent.innerHTML = '';
                    layerMain.style.display = 'none';
                }
            });
        }
        else {
            
            anime({
                targets: layerMenu,
                width: ['35vw', '100vw'],
                easing: 'linear',
                duration: 600,
                begin: function(anim) { }
            });
            
            anime({
                targets: layerMain,
                right: ['0vw', '-65vw'],
                easing: 'linear',
                duration: 600,
                begin: function(anim) {
                    layerMain.style.display = 'block';
                    document.getElementById('LayerContent').scrollTop = 0;
                },
                complete: function(anim) {
                    layerContent.innerHTML = '';
                    layerMain.style.display = 'none';
                }
            });
        }
    });

    
    window.addEventListener('keyup', function(e) {
        if(e.key == 'ArrowLeft'){
            animationOrientation = 'left';
            fn_navSlide();
        }
        if(e.key == 'ArrowRight'){
            animationOrientation = 'right';
            fn_navSlide();
        }
    });

    /*
    window.addEventListener('resize', function() {
        fn_resize();
    });
    */
}

function fn_navSlide(){
    if(animationOrientation == 'right'){
        currentPosition += 1;
    }
    if(animationOrientation == 'left') {
        currentPosition -= 1;
    }
    checkPosition();
    lastSlide = [...itemMenus][lastPosition];
    currentSlide = [...itemMenus][currentPosition - 1];  
    bd.setAttribute('data-position', currentPosition);    
    document.querySelector('.current-theme').innerHTML = currentSlide.getAttribute('data-item');                
    animationSlider();
}

function animationSlider () {
    console.log(animationOrientation);
    if(animationOrientation == 'right'){
        anime({
            targets: lastSlide,
            clip: ['rect(0vh,100vw,100vh,0vw)', 'rect(0vh,0vw,100vh,0vw)'],
            easing: 'linear',
            duration: 800,
            begin: function(anim) {
                lastSlide.style.zIndex = 1;
            }
        });

        anime({
            targets: currentSlide,
            clip: ['rect(0vh,100vw,100vh,100vw)', 'rect(0vh,100vw,100vh,0vw)'],
            easing: 'linear',
            duration: 800,
            begin: function(anim) {
                currentSlide.style.zIndex = 2;
            }
        });
    }

    if(animationOrientation == 'left') {
        anime({
            targets: lastSlide,
            clip: ['rect(0vh,100vw,100vh,0vw)','rect(0vh,100vw,100vh,100vw)'],
            easing: 'linear',
            duration: 800,
            begin: function(anim) {
                lastSlide.style.zIndex = 1;
            }
        });
        anime({
            targets: currentSlide,
            clip: [ 'rect(0vh,0vw,100vh,0vw)', 'rect(0vh,100vw,100vh,0vw)'],
            easing: 'linear',
            duration: 800,
            begin: function(anim) {
                currentSlide.style.zIndex = 2;
            }
        });
    }
}

function fn_resize() {
    let screenWidth, screenHeight, scaleWidth, scaleHeight, w, h, t, l;
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    scaleWidth = screenWidth / basePage.width;
    scaleHeight = screenHeight / basePage.height;
    w = 0,
    h = 0;
    if(scaleWidth <= 1 || scaleHeight <= 1)
    {
        basePage.scale = Math.max(scaleWidth, scaleHeight);  
    }
    else {
        basePage.scale = 1;
    }

    w = basePage.width * basePage.scale;
    h = basePage.height * basePage.scale;
    t = (h - window.innerHeight) / -2;
    l = (w - window.innerWidth) / -2;
    layerContent.style.transform = 'scale('+basePage.scale+')';
}

function checkPosition(){
    if(currentPosition > totalThemes)
        currentPosition = 1;
    
    if(currentPosition < 1)
        currentPosition = totalThemes;

    if(animationOrientation == 'right'){
        lastPosition = currentPosition == 1 ? totalThemes - 1 : currentPosition - 2;
    }

    if(animationOrientation == 'left'){
        lastPosition = currentPosition == totalThemes ? 0 : currentPosition;
    }
}

function openFullscreen() {
    if (bd.requestFullscreen) {
        bd.requestFullscreen();
    } else if (bd.webkitRequestFullscreen) { /* Safari */
        bd.webkitRequestFullscreen();
    } else if (bd.msRequestFullscreen) { /* IE11 */
        bd.msRequestFullscreen();
    }
}