document.addEventListener("DOMContentLoaded", function() {
    const draggableElements = document.querySelectorAll("h2");

    draggableElements.forEach(element => {
        element.addEventListener("mousedown", mouseDownHandler);
    });

    function mouseDownHandler(event) {
        const element = event.target;
        element.style.position = 'absolute';
        element.style.zIndex = 1000;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - element.offsetWidth / 2 + 'px';
            element.style.top = pageY - element.offsetHeight / 2 + 'px';
        }

        moveAt(event.pageX, event.pageY);

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        element.onmouseup = function() {
            document.removeEventListener("mousemove", onMouseMove);
            element.onmouseup = null;
        };
    }

    draggableElements.forEach(element => {
        element.ondragstart = function() {
            return false;
        };
    });
});
