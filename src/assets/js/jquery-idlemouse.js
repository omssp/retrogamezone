(function ($, $w) {
    // Expose configuration option
    // Idle is triggered when no events for 4 seconds
    $.idleTimeout = 2000;

    // Currently in idle state
    var idle = false;

    // Handle to idle timer for detection
    var idleTimer = null;

    // Start the idle timer and bind events on load (not DOM-ready)
    $w.on('load', function () {
        startIdleTimer();
        $w.on('focus resize mousemove', startIdleTimer)
            .on('blur', idleStart) // Force idle when in a different tab/window
            ;
    });

    function startIdleTimer() {
        clearTimeout(idleTimer); // Clear prior timer

        if (idle) $w.trigger('idle:stop'); // If idle, send stop event
        idle = false; // Not idle

        var timeout = ~~$.idleTimeout; // Option to integer
        if (timeout <= 100)
            timeout = 100; // Minimum 100 ms
        if (timeout > 300000)
            timeout = 300000; // Maximum 5 minutes

        idleTimer = setTimeout(idleStart, timeout); // New timer
    }

    function idleStart() {
        if (!idle)
            $w.trigger('idle:start');
        idle = true;
    }

}(window.jQuery, window.jQuery(window)))