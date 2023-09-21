document.addEventListener('DOMContentLoaded', function () {
    const avatarSelect = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatar-preview');

    avatarSelect.addEventListener('change', function () {
        const selectedOption = avatarSelect.options[avatarSelect.selectedIndex];
        const imagePath = selectedOption.getAttribute('data-image');

        if (imagePath) {
            avatarPreview.src = imagePath;
            avatarPreview.style.display = 'block';
        } else {
            avatarPreview.style.display = 'none';
        }
    });
});