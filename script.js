document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const desktop = document.getElementById('desktop');
    const restartDesktopIcon = document.getElementById('restartDesktopIcon');
    const currentTimeSpan = document.getElementById('currentTime');

    let loaderTimeout;

    /**
     * Updates the current time in the system tray.
     */
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeSpan.textContent = `${hours}:${minutes}`;
    }

    /**
     * Resets and starts the loader animation.
     * Hides the desktop and sets a timeout for the loader to fade out.
     */
    function showLoader() {
        desktop.classList.add('hidden');
        loader.classList.remove('hidden', 'fade-out');

        // Force reflow to restart CSS animations
        loader.style.animation = 'none';
        void loader.offsetWidth; // Trigger reflow
        loader.style.animation = ''; // Re-enable animation (inherits from CSS)

        // Also restart animations for nested elements if they have their own animations
        loader.querySelectorAll('.bg, .circle').forEach(el => {
            el.style.animation = 'none';
            void el.offsetWidth; // Trigger reflow
            el.style.animation = ''; // Re-enable animation
        });

        // Set timeout for 15 seconds to start the fade-out
        loaderTimeout = setTimeout(() => {
            loader.classList.add('fade-out'); // Start fade-out transition
            // Listen for the end of the opacity transition to fully hide and show desktop
            loader.addEventListener('transitionend', handleFadeOutEnd, { once: true });
        }, 15000); // 15 seconds
    }

    /**
     * Handles the end of the loader's fade-out transition.
     * Hides the loader completely and shows the desktop.
     */
    function handleFadeOutEnd() {
        loader.classList.add('hidden'); // Fully hide loader (display: none)
        desktop.classList.remove('hidden'); // Show desktop
        // Remove the event listener to prevent multiple calls
        loader.removeEventListener('transitionend', handleFadeOutEnd);
    }

    /**
     * Restarts the entire process: clears existing timeouts and shows the loader again.
     */
    function restart() {
        clearTimeout(loaderTimeout); // Clear any pending fade-out timeout
        showLoader(); // Start the loader animation again
    }

    // Add event listener to the restart desktop icon
    if (restartDesktopIcon) {
        restartDesktopIcon.addEventListener('click', restart);
    }

    // Initial call to show the loader when the page loads
    showLoader();

    // Update time every minute
    updateTime(); // Initial call
    setInterval(updateTime, 60000);
});
