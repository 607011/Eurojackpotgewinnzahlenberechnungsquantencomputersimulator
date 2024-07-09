(function (window) {
    "use strict";

    const AnimationDurationMs = 500;

    let el = {};
    let t0;

    function activate() {
        const show = () => {
            for (const lamp of document.querySelectorAll('.lamp')) {
                lamp.style.visibility = 'visible';
            }
        };
        for (const lamp of document.querySelectorAll('.lamp')) {
            const delay = Math.random() * AnimationDurationMs;
            lamp.setAttribute('data-delay', delay);
            lamp.style.animationDelay = `${delay}ms`;
        }
        setTimeout(show, AnimationDurationMs);
        t0 = window.performance.now();
    }

    function markBrightestLamps(dt, selector, n) {
        let brighestLamps = [];
        for (const field of document.querySelectorAll(selector)) {
            let leastDiff = Number.MAX_VALUE;
            let brightestLamp = null;
            for (const lamp of field.querySelectorAll('.lamp')) {
                const delay = parseFloat(lamp.getAttribute('data-delay'));
                const diff = Math.abs(delay - dt);
                if (diff < leastDiff) {
                    brightestLamp = lamp;
                    leastDiff = diff;
                }
            }
            brighestLamps.push({
                dt: leastDiff,
                el: brightestLamp,
            });
            brightestLamp.classList.add('marked');
        }
        brighestLamps.sort((a, b) => {
            return (a.dt < b.bt) ? -1 : (a.dt > b.dt) ? 1 : 0;
        });
        for (const brightestLamp of brighestLamps.slice(0, n)) {
            
            brightestLamp.el.parentElement.querySelector('.number').style.display = 'block';
        }
    }

    function measure(e) {
        const dt = (window.performance.now() - t0) % AnimationDurationMs;
        if (el.root.style.getPropertyValue('--animation-state') === 'paused') {
            el.root.style.setProperty('--animation-state', 'running');
        }
        else {
            el.root.style.setProperty('--animation-state', 'paused');
        }
        console.debug(`dt = ${window.performance.now() - t0}`);
        console.debug(`dt% = ${dt}`);
        markBrightestLamps(dt, '#ticket .left .field', 5);
        markBrightestLamps(dt, '#ticket .right .field', 2);
        e.target.setAttribute('disabled', true);
        e.target.style.cursor = 'not-allowed';
        e.target.removeEventListener('click', measure);
    }

    function main() {
        el.root = document.querySelector(':root');
        el.root.style.setProperty('--animation-duration', `${AnimationDurationMs}ms`);

        el.left = document.querySelector('#ticket .left');
        for (let i = 0; i < 50; ++i) {
            const field = document.createElement('span');
            field.className = `field f${i}`;
            field.setAttribute('data-num', `${i + 1}`);
            const number = document.createElement('span');
            number.textContent = i + 1;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 50; ++j) {
                const lamp = document.createElement('span');
                lamp.className = `lamp n${j}`;
                lamp.style.visibility = 'hidden';
                lamp.setAttribute('data-value', `${j + 1}`);
                field.append(lamp);
            }
            el.left.append(field);
        }

        el.right = document.querySelector('#ticket .right');
        for (let i = 0; i < 12; ++i) {
            const field = document.createElement('span');
            field.className = `field f${i}`;
            field.setAttribute('data-num', `${i + 1}`);
            const number = document.createElement('span');
            number.textContent = i + 1;
            number.className = 'number';
            field.append(number);
            for (let j = 0; j < 12; ++j) {
                const lamp = document.createElement('span');
                lamp.className = `lamp n${j}`;
                lamp.style.visibility = 'hidden';
                lamp.setAttribute('data-value', `${j + 1}`);
                field.append(lamp);
            }
            el.right.append(field);
        }

        const displayButton = document.createElement('button');
        displayButton.textContent = 'Messen';
        displayButton.addEventListener('click', measure);
        el.right.append(displayButton);

        activate();
    }

    window.addEventListener('load', main);
})(window);
