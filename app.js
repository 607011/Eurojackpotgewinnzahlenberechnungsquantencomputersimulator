(function (window) {
    "use strict";

    const AnimationDurationMs = 451;

    let el = {};
    let allLamps = [];
    let running = true;

    function upAndDownLinear(t) {
        return (t < 0.5) ? 2 * t : 1 - t;
    }

    const easing = upAndDownLinear;

    function update(t) {
        if (!running)
            return;
        allLamps.forEach(lamp => {
            lamp.el.style.opacity = easing((Math.abs(lamp.offset - t) % AnimationDurationMs) / AnimationDurationMs);
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
                lamp.el.parentElement.querySelector('.number').classList.add('visible');
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
            field.className = 'field';
            const number = document.createElement('span');
            number.textContent = `${i + 1}`;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 50; ++j) {
                const lamp = document.createElement('span');
                lamp.className = 'lamp';
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
            field.className =  'field';
            const number = document.createElement('span');
            number.textContent = `${i + 1}`;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 12; ++j) {
                const lamp = document.createElement('span');
                lamp.className = 'lamp';
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
    }

    window.addEventListener('load', main);
})(window);
