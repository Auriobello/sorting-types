class SortingVisualizer {
    constructor(containerId, algorithm) {
        this.container = document.getElementById(containerId);
        this.algorithm = algorithm;
        this.array = [];
        this.isRunning = false;
        this.animationSpeed = 100; // ms
        this.lastSpeed = this.animationSpeed;
        this.arraySize = 20;
        this.maxValue = 100;
        this.superMode = false;
        this.timeoutEnabled = true;
        this.cancelUsed = false;
        this.reset();
    }

    reset() {
        this.array = this.generateRandomArray(this.arraySize, this.maxValue);
        this.render();
        this.updateStatus('Pronto');
        this.isRunning = false;
        this.timeoutEnabled = true;
        this.cancelUsed = false;
    }

    generateRandomArray(size, max) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * max) + 1);
        }
        return arr;
    }

    setArraySize(size) {
        this.arraySize = Math.max(10, Math.min(100, size));
        this.reset();
    }

    setSpeed(speed) {
        if (!this.superMode) {
            this.animationSpeed = Math.max(10, Math.min(1000, speed));
            this.lastSpeed = this.animationSpeed;
        }
    }

    toggleSuperMode() {
        this.superMode = !this.superMode;
        const statusElement = document.getElementById('status');
        if (this.superMode) {
            this.lastSpeed = this.animationSpeed;
            this.animationSpeed = 1; // Super velocità!
            this.timeoutEnabled = false; // infinite attempts in super mode
            this.updateStatus('🚀 MODALITÀ SUPER ATTIVA! 🚀');
            statusElement.classList.add('super-status');
        } else {
            this.animationSpeed = this.lastSpeed || 100; // Restore the previous speed
            this.timeoutEnabled = true;
            this.updateStatus('Modalità super disattivata');
            statusElement.classList.remove('super-status');
        }
        return this.superMode;
    }

    disableTimeout() {
        if (this.cancelUsed) return false;
        this.cancelUsed = true;
        this.timeoutEnabled = false;
        this.updateStatus('Timeout disabilitato: il mix continua all infinito.');
        return true;
    }

    render(highlights = []) {
        this.container.innerHTML = '';
        const maxHeight = Math.max(...this.array);
        const barWidth = Math.max(5, (this.container.offsetWidth - 20) / this.array.length - 2);

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxHeight) * 100}%`;
            bar.style.width = `${barWidth}px`;
            bar.style.left = `${index * (barWidth + 2)}px`;

            if (highlights.includes(index)) {
                bar.classList.add('highlight');
            }

            this.container.appendChild(bar);
        });
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateStatus('Ordinamento in corso...');

        try {
            const sorted = await this[this.algorithm]();
            if (sorted) {
                this.updateStatus('Ordinamento completato!');
            }
        } catch (error) {
            this.updateStatus('Errore durante l\'ordinamento');
            console.error(error);
        } finally {
            this.isRunning = false;
        }
    }

    // Bogosort implementation
    async bogosort() {
        const isSorted = (arr) => {
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] > arr[i + 1]) return false;
            }
            return true;
        };

        const shuffle = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        };

        let attempts = 0;
        const startTime = Date.now();

        while (!isSorted(this.array) && this.isRunning) {
            shuffle(this.array);
            attempts++;

            const elapsed = Date.now() - startTime;
            if (!this.superMode && this.timeoutEnabled && elapsed > 30000) {
                this.render();
                this.updateStatus('⏱ Timeout di 30 secondi raggiunto. Usa Ignora Timeout per continuare.');
                break;
            }

            if (this.superMode) {
                this.render();
                this.updateStatus(`🚀 Tentativo ${attempts} (SUPER)...`);
                await this.sleep(1);
            } else {
                this.render();
                this.updateStatus(`Tentativo ${attempts}...`);
                await this.sleep(this.animationSpeed);
            }
        }

        if (isSorted(this.array)) {
            this.render();
            this.updateStatus(this.superMode ? `🚀 ORDINATO in ${attempts} tentativi (MODALITÀ SUPER)! 🚀` : `Ordinato in ${attempts} tentativi!`);
            return true;
        } else if (!this.isRunning) {
            this.updateStatus('Ordinamento interrotto.');
            return false;
        }

        return false;
    }

    // Quicksort implementation
    async quicksort() {
        const partition = async (arr, low, high) => {
            const pivot = arr[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                if (!this.isRunning) return;
                this.render([j, high]);
                await this.sleep(this.animationSpeed);

                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    this.render([i, j]);
                    await this.sleep(this.animationSpeed);
                }
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            this.render([i + 1, high]);
            await this.sleep(this.animationSpeed);

            return i + 1;
        };

        const quicksortRecursive = async (arr, low, high) => {
            if (low < high && this.isRunning) {
                const pi = await partition(arr, low, high);
                await quicksortRecursive(arr, low, pi - 1);
                await quicksortRecursive(arr, pi + 1, high);
            }
        };

        await quicksortRecursive(this.array, 0, this.array.length - 1);
    }

    // Bubblesort implementation
    async bubblesort() {
        for (let i = 0; i < this.array.length - 1 && this.isRunning; i++) {
            for (let j = 0; j < this.array.length - i - 1 && this.isRunning; j++) {
                this.render([j, j + 1]);
                await this.sleep(this.animationSpeed);

                if (this.array[j] > this.array[j + 1]) {
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.render([j, j + 1]);
                    await this.sleep(this.animationSpeed);
                }
            }
        }
    }

    // Shakesort (Cocktail sort) implementation
    async shakesort() {
        let start = 0;
        let end = this.array.length - 1;
        let swapped = true;

        while (swapped && this.isRunning) {
            swapped = false;

            // Forward pass
            for (let i = start; i < end && this.isRunning; i++) {
                this.render([i, i + 1]);
                await this.sleep(this.animationSpeed);

                if (this.array[i] > this.array[i + 1]) {
                    [this.array[i], this.array[i + 1]] = [this.array[i + 1], this.array[i]];
                    swapped = true;
                    this.render([i, i + 1]);
                    await this.sleep(this.animationSpeed);
                }
            }

            if (!swapped) break;
            swapped = false;
            end--;

            // Backward pass
            for (let i = end - 1; i >= start && this.isRunning; i--) {
                this.render([i, i + 1]);
                await this.sleep(this.animationSpeed);

                if (this.array[i] > this.array[i + 1]) {
                    [this.array[i], this.array[i + 1]] = [this.array[i + 1], this.array[i]];
                    swapped = true;
                    this.render([i, i + 1]);
                    await this.sleep(this.animationSpeed);
                }
            }

            start++;
        }
    }

    // Insertionsort implementation
    async insertionsort() {
        for (let i = 1; i < this.array.length && this.isRunning; i++) {
            let key = this.array[i];
            let j = i - 1;

            this.render([i]);
            await this.sleep(this.animationSpeed);

            while (j >= 0 && this.array[j] > key && this.isRunning) {
                this.array[j + 1] = this.array[j];
                this.render([j, j + 1]);
                await this.sleep(this.animationSpeed);
                j--;
            }

            this.array[j + 1] = key;
            this.render([j + 1]);
            await this.sleep(this.animationSpeed);
        }
    }

    // Selectionsort implementation
    async selectionsort() {
        for (let i = 0; i < this.array.length - 1 && this.isRunning; i++) {
            let minIdx = i;

            for (let j = i + 1; j < this.array.length && this.isRunning; j++) {
                this.render([minIdx, j]);
                await this.sleep(this.animationSpeed);

                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.render([i, minIdx]);
                await this.sleep(this.animationSpeed);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ═══════════════════════════════════════════════════
// BOGOSORT PAGE-SPECIFIC INITIALIZATION (moved from bogosort.html)
// Only runs on bogosort.html
// ═══════════════════════════════════════════════════
if (window.location.pathname.includes('bogosort.html') || window.location.pathname.includes('bogosort')) {
    document.addEventListener('DOMContentLoaded', function() {
        const visualizer = new SortingVisualizer('bars-container', 'bogosort');
        const superBtn = document.getElementById('super-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const rocket = document.getElementById('rocket');
        const fireBurst = document.getElementById('fire-burst');

        // Controlli dimensione array
        const sizeSlider = document.getElementById('array-size');
        const sizeDisplay = document.getElementById('size-display');
        sizeSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            sizeDisplay.textContent = value;
            visualizer.setArraySize(value);
        });

        // Controlli velocità
        const speedSlider = document.getElementById('speed');
        const speedDisplay = document.getElementById('speed-display');
        speedSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            speedDisplay.textContent = value + 'ms';
            visualizer.setSpeed(value);
        });

        // Pulsante modalità super
        superBtn.addEventListener('click', function() {
            const isSuper = visualizer.toggleSuperMode();
            if (isSuper) {
                superBtn.classList.add('active');
                superBtn.textContent = '🔥 SUPER ATTIVA';
                speedSlider.disabled = true;
                startRocket();
                speedDisplay.textContent = '1ms';
            } else {
                superBtn.classList.remove('active');
                superBtn.textContent = '🚀 Modalità Super';
                speedSlider.disabled = false;
                resetRocket();
                speedDisplay.textContent = speedSlider.value + 'ms';
            }
        });

        cancelBtn.addEventListener('click', function() {
            if (visualizer.disableTimeout()) {
                cancelBtn.disabled = true;
            }
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            cancelBtn.disabled = false;
            visualizer.timeoutEnabled = true;
            visualizer.cancelUsed = false;
            visualizer.start();
        });
        document.getElementById('reset-btn').addEventListener('click', () => {
            if (visualizer.superMode) {
                visualizer.toggleSuperMode();
                superBtn.classList.remove('active');
                superBtn.textContent = '🚀 Modalità Super';
                speedSlider.disabled = false;
            }
            speedDisplay.textContent = speedSlider.value + 'ms';
            visualizer.reset();
            cancelBtn.disabled = false;
            resetRocket();
        });

        function startRocket() {
            const speedGroup = document.getElementById('speed-group');
            // Kill any leftover elements from a previous activation
            document.querySelectorAll('.fly-rocket-el,.crash-flash-el,.spark-el').forEach(el => el.remove());
            speedGroup.classList.remove('on-fire');

            // ── Where exactly is the speed slider on screen? ──
            const rect = speedSlider.getBoundingClientRect();
            const targetX = rect.left + rect.width  / 2;
            const targetY = rect.top  + rect.height / 2;

            // ── Rocket starts off-screen left, vertically level with slider ──
            const startX = -90;
            const startY = targetY + 40; // a bit below so arc feels natural

            const flyRocket = document.createElement('div');
            flyRocket.className = 'fly-rocket-el';
            flyRocket.textContent = '🚀';
            flyRocket.style.left = startX + 'px';
            flyRocket.style.top  = startY + 'px';
            // CSS vars drive the keyframe calc() expressions
            flyRocket.style.setProperty('--tx', (targetX - startX) + 'px');
            flyRocket.style.setProperty('--ty', (targetY - startY) + 'px');
            document.body.appendChild(flyRocket);

            flyRocket.addEventListener('animationend', () => {
                flyRocket.remove();
                _triggerCrash(targetX, targetY, speedGroup);
            }, { once: true });
        }

        function _triggerCrash(cx, cy, speedGroup) {
            // 1 ── Full-screen flash
            const flash = document.createElement('div');
            flash.className = 'crash-flash-el';
            document.body.appendChild(flash);
            flash.addEventListener('animationend', () => flash.remove(), { once: true });

            // 2 ── Container shake
            const visCont = document.getElementById('visualization-container');
            visCont.classList.remove('shaking');
            void visCont.offsetWidth;
            visCont.classList.add('shaking');
            visCont.addEventListener('animationend', () => visCont.classList.remove('shaking'), { once: true });

            // 3 ── 20 sparks fanning out in all directions
            const sparkColors = ['#7ef0ff','#4be3ff','#08c6ff','#a6f7ff','#e5ffff','#b0f0ff'];
            for (let i = 0; i < 20; i++) {
                const spark = document.createElement('div');
                spark.className = 'spark-el';
                const angle = (Math.PI * 2 * i / 20) + (Math.random() - 0.5) * 0.5;
                const dist  = 55 + Math.random() * 140;
                const size  = 5 + Math.random() * 7;
                const col   = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                spark.style.cssText = `
                    left: ${cx - size/2}px; top: ${cy - size/2}px;
                    width: ${size}px; height: ${size}px;
                    background: ${col};
                    box-shadow: 0 0 ${size*1.5}px ${col}, 0 0 ${size*3}px ${col};
                `;
                spark.style.setProperty('--sx',   Math.cos(angle) * dist + 'px');
                spark.style.setProperty('--sy',   Math.sin(angle) * dist + 'px');
                spark.style.setProperty('--sdur', (0.40 + Math.random() * 0.60) + 's');
                document.body.appendChild(spark);
                spark.addEventListener('animationend', () => spark.remove(), { once: true });
            }

            // 4 ── Light the slider on fire once the smoke settles
            setTimeout(() => speedGroup.classList.add('on-fire'), 380);
        }

        function resetRocket() {
            const speedGroup = document.getElementById('speed-group');
            document.querySelectorAll('.fly-rocket-el,.crash-flash-el,.spark-el').forEach(el => el.remove());
            speedGroup.classList.remove('on-fire');
            const visCont = document.getElementById('visualization-container');
            visCont.classList.remove('shaking');
        }
    });
}

