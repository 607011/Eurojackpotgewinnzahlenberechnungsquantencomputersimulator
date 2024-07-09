(function (window) {
    "use strict";

    const AnimationDurationMs = 500;

    let el = {};
    let allLamps = [];
    let t0;
    let running = true;

    function easing(t) {
        return (t < 0.5) ? 2 * t : 1 - t;
    }

    function update() {
        if (!running)
            return;
        const dt = window.performance.now() - t0;
        allLamps.forEach(lamp => {
            lamp.el.style.opacity = easing((Math.abs(lamp.offset - dt) % AnimationDurationMs) / AnimationDurationMs);
        });
        window.requestAnimationFrame(update);
    }

    function measure(e) {
        const markBrightestLamps = (selector, n) => {
            let brighestLamps = [];
            for (const field of document.querySelectorAll(selector)) {
                let maxOpacity = Number.MIN_VALUE;
                let brightestLamp = null;
                for (const lamp of field.querySelectorAll('.lamp')) {
                    const opacity = parseFloat(lamp.style.opacity);
                    if (opacity > maxOpacity) {
                        brightestLamp = lamp;
                        maxOpacity = opacity;
                    }
                }
                brighestLamps.push({
                    opacity: maxOpacity,
                    el: brightestLamp,
                });
                brightestLamp.classList.add('marked');
            }
            brighestLamps.sort((a, b) => {
                return b.opacity - a.opacity;
            });
            brighestLamps.slice(0, n).forEach(lamp => {
                lamp.el.parentElement.querySelector('.number').style.display = 'block';
            });
        };

        running = false;
        markBrightestLamps('#ticket .left .field', 5);
        markBrightestLamps('#ticket .right .field', 2);
        e.target.setAttribute('disabled', true);
        e.target.style.cursor = 'not-allowed';
        e.target.removeEventListener('click', measure);
    }

    function main() {
        el.left = document.querySelector('#ticket .left');
        for (let i = 0; i < 50; ++i) {
            const field = document.createElement('span');
            field.className = `field f${i}`;
            const number = document.createElement('span');
            number.textContent = `${i + 1}`;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 50; ++j) {
                const lamp = document.createElement('span');
                lamp.className = `lamp n${j}`;
                field.append(lamp);
                allLamps.push({
                    el: lamp,
                    offset: Math.random() * AnimationDurationMs,
                });
            }
            el.left.append(field);
        }

        el.right = document.querySelector('#ticket .right');
        for (let i = 0; i < 12; ++i) {
            const field = document.createElement('span');
            field.className = `field f${i}`;
            const number = document.createElement('span');
            number.textContent = `${i + 1}`;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 12; ++j) {
                const lamp = document.createElement('span');
                lamp.className = `lamp n${j}`;
                field.append(lamp);
                allLamps.push({
                    el: lamp,
                    offset: Math.random() * AnimationDurationMs,
                });
            }
            el.right.append(field);
        }
        const displayButton = document.createElement('button');
        displayButton.textContent = 'Messen';
        displayButton.addEventListener('click', measure);
        el.right.append(displayButton);

        window.requestAnimationFrame(update);
        t0 = window.performance.now();
    }

    window.addEventListener('load', main);
})(window);
