document.addEventListener('DOMContentLoaded', function () {
    const imageContainers = document.querySelectorAll('.img-container');
    
    imageContainers.forEach(container => {
        container.addEventListener('click', function (event) {
            if (event.target.tagName === 'IMG') {
                const checkbox = container.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
        });
    });
});