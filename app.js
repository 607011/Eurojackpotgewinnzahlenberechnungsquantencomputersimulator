/*
   Copyright (c) 2024 Oliver Lau, oliver@ersatzworld.net
*/

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

    const fps = new Array(5).fill(0);
    let lastT = 0;
    let tIdx = 0;

    function update(t) {
        if (!running)
            return;
        allLamps.forEach(lamp => {
            lamp.el.style.opacity = easing((Math.abs(lamp.offset - t) % AnimationDurationMs) / AnimationDurationMs);
        });
        fps[tIdx++] = 1000 / (t - lastT);
        if (tIdx === fps.length)
            tIdx = 0;
        lastT = t;
        el.fps.textContent = `${Math.round(fps.reduce((a, b) => a + b, 0) / fps.length)}/s`;
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
        el.fps.style.display = 'none';
    }

    const mt = {
        randint: null,
        seed: null,
        seed_seq: null,
    };

    let instance = null;

    async function loadWASM() {
        try {
            instance = (await WebAssembly.instantiateStreaming(fetch('MT/MT.wasm'))).instance;
        }
        catch (e) {
            console.error(e);
        }
        mt.n = instance.exports.n();
        mt.seed = instance.exports.init_genrand;
        mt.seed_seq = instance.exports.init_by_array;
        mt.randint = instance.exports.genrand_int31;
    }

    async function init() {
        const BUFSIZE = mt.n;
        const seeds = new Uint32Array(BUFSIZE);
        crypto.getRandomValues(seeds);
        const memory = instance.exports.memory;
        const memView = new Uint32Array(memory.buffer);
        seeds.forEach((val, idx) => memView[idx] = val);
        mt.seed_seq(memView.byteOffset, BUFSIZE);

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
                    offset: mt.randint() % AnimationDurationMs,
                });
            }
            el.left.append(field);
        }

        el.right = document.querySelector('#ticket .right');
        for (let i = 0; i < 12; ++i) {
            const field = document.createElement('span');
            field.className = 'field';
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
                    offset: mt.randint() % AnimationDurationMs,
                });
            }
            el.right.append(field);
        }
    }

    function main() {
        el.measureButton = document.querySelector('#measure-button');
        el.measureButton.addEventListener('click', measure);
        el.fps = document.querySelector('#fps');
        loadWASM().then(init).then(update);
    }

    window.addEventListener('load', main);

})(window);
