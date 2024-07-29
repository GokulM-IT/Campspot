function saveScrollPosition() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
}

function restoreScrollPosition() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');

    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem('scrollPosition'); 
    }
}

window.addEventListener('load', restoreScrollPosition);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.expand-content').addEventListener('click', saveScrollPosition);
});

