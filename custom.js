function showAndHide(_show, _hide = null) {
    document.querySelector(_show).classList.add('active');
    if(_hide != null) 
        document.querySelector(_hide).classList.remove('active');
}

function activeMenuItem(_id) {
    document.querySelector('#'+_id+' .locked').style.display = 'none';
    document.querySelector('#'+_id+' .text-menu').classList.remove('lock');
    document.body.setAttribute('data-position', 0);
}