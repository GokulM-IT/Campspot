function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        alert('No previous page found.');
    }
}