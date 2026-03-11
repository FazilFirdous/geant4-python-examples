const Navbar = {
    _bound: false,

    init() {
        if (!this._bound) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const screen = item.dataset.screen;
                    window.location.hash = '#' + screen;
                });
            });
            this._bound = true;
        }
        // Activate icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    setActive(screen) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screen);
        });
    }
};
