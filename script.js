class KernelFilteringDemo {
    constructor() {
        this.kernelSize = 3;
        this.inputSize = 7;
        this.outputSize = 5; // 7 - 3 + 1 = 5
        this.currentRow = 0;
        this.currentCol = 0;
            // Fixed start position (right edge of kernel area)
        const startX = 450;  // Moved to right side of kernel
        const startY = 150; 
        this.kernelMatrix = [];
        this.inputMatrix = [];
        this.outputMatrix = [];
        
        this.init();
    }

    init() {
        this.generateRandomData();
        this.createMatrices();
        this.setupEventListeners();
        this.updateDisplay();
        
        // Initialize arrow position after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.updateConnectionLines();
        }, 100);
    }

    generateRandomData() {
        // Generate random kernel (3x3) with values 0.0 to 1.0
        this.kernelMatrix = [];
        for (let i = 0; i < this.kernelSize; i++) {
            this.kernelMatrix[i] = [];
            for (let j = 0; j < this.kernelSize; j++) {
                this.kernelMatrix[i][j] = Math.round(Math.random() * 10) / 10;
            }
        }

        // Generate random input matrix (10x10) with integers 1-9
        this.inputMatrix = [];
        for (let i = 0; i < this.inputSize; i++) {
            this.inputMatrix[i] = [];
            for (let j = 0; j < this.inputSize; j++) {
                this.inputMatrix[i][j] = Math.floor(Math.random() * 9) + 1;
            }
        }

        // Initialize output matrix with dashes
        this.outputMatrix = [];
        for (let i = 0; i < this.outputSize; i++) {
            this.outputMatrix[i] = [];
            for (let j = 0; j < this.outputSize; j++) {
                this.outputMatrix[i][j] = '-';
            }
        }
    }

    createMatrices() {
        this.createKernelMatrix();
        this.createInputMatrix();
        this.createOutputMatrix();
    }

    createKernelMatrix() {
        const kernelContainer = document.getElementById('kernel-matrix');
        kernelContainer.innerHTML = '';
        
        for (let i = 0; i < this.kernelSize; i++) {
            for (let j = 0; j < this.kernelSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell kernel-cell';
                cell.textContent = this.kernelMatrix[i][j];
                cell.id = `kernel-${i}-${j}`;
                kernelContainer.appendChild(cell);
            }
        }
    }

    createInputMatrix() {
        const inputContainer = document.getElementById('input-matrix');
        inputContainer.innerHTML = '';
        
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.inputSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell input-cell';
                cell.textContent = this.inputMatrix[i][j];
                cell.id = `input-${i}-${j}`;
                inputContainer.appendChild(cell);
            }
        }
    }

    createOutputMatrix() {
        const outputContainer = document.getElementById('output-matrix');
        outputContainer.innerHTML = '';
        
        for (let i = 0; i < this.outputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell output-cell';
                cell.textContent = this.outputMatrix[i][j];
                cell.id = `output-${i}-${j}`;
                outputContainer.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('upBtn').addEventListener('click', () => this.moveKernel(-1, 0));
        document.getElementById('downBtn').addEventListener('click', () => this.moveKernel(1, 0));
        document.getElementById('leftBtn').addEventListener('click', () => this.moveKernel(0, -1));
        document.getElementById('rightBtn').addEventListener('click', () => this.moveKernel(0, 1));
        
        // Control buttons
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomizeData());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveKernel(-1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveKernel(1, 0);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveKernel(0, -1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveKernel(0, 1);
                    break;
            }
        });
    }

    moveKernel(deltaRow, deltaCol) {
        const newRow = this.currentRow + deltaRow;
        const newCol = this.currentCol + deltaCol;
        
        // Check boundaries
        if (newRow >= 0 && newRow < this.outputSize && newCol >= 0 && newCol < this.outputSize) {
            this.currentRow = newRow;
            this.currentCol = newCol;
            this.performConvolution();
            this.updateDisplay();
        }
    }

    performConvolution() {
        let sum = 0;
        let calculation = "";
        
        for (let i = 0; i < this.kernelSize; i++) {
            for (let j = 0; j < this.kernelSize; j++) {
                const inputValue = this.inputMatrix[this.currentRow + i][this.currentCol + j];
                const kernelValue = this.kernelMatrix[i][j];
                const product = inputValue * kernelValue;
                sum += product;
                
                if (calculation !== "") calculation += " + ";
                calculation += `(${inputValue} × ${kernelValue})`;
            }
        }
        
        // Round to 1 decimal place
        const result = Math.round(sum * 10) / 10;
        this.outputMatrix[this.currentRow][this.currentCol] = result;
        
        // Update calculation display
        document.getElementById('calculation-display').innerHTML = 
            `<strong>Position (${this.currentRow}, ${this.currentCol}):</strong><br>` +
            `${calculation}<br>` +
            `<strong>Result: ${result}</strong>`;
    }

    updateDisplay() {
        // Update position display
        document.getElementById('pos-row').textContent = this.currentRow;
        document.getElementById('pos-col').textContent = this.currentCol;
        
        // Update kernel overlay position
        const overlay = document.getElementById('kernel-overlay');
        const cellSize = 42; // 40px + 2px gap
        overlay.style.left = `${10 + this.currentCol * cellSize}px`;
        overlay.style.top = `${10 + this.currentRow * cellSize}px`;
        
        // Update connection lines
        this.updateConnectionLines();
        
        // Update navigation buttons
        document.getElementById('upBtn').disabled = this.currentRow === 0;
        document.getElementById('downBtn').disabled = this.currentRow === this.outputSize - 1;
        document.getElementById('leftBtn').disabled = this.currentCol === 0;
        document.getElementById('rightBtn').disabled = this.currentCol === this.outputSize - 1;
        
        // Highlight current input region
        this.highlightInputRegion();
        
        // Update output matrix display
        this.updateOutputMatrix();
    }

    updateConnectionLines() {
        const linesContainer = document.getElementById('connection-lines');
        if (!linesContainer) return;
        
        // Clear existing lines
        linesContainer.innerHTML = '';
        
        // Get kernel and input matrix positions
        const kernelMatrix = document.getElementById('kernel-matrix');
        const inputMatrix = document.getElementById('input-matrix');
        
        if (!kernelMatrix || !inputMatrix) return;
        
        const containerRect = document.querySelector('.matrices-container').getBoundingClientRect();
        const kernelRect = kernelMatrix.getBoundingClientRect();
        const inputRect = inputMatrix.getBoundingClientRect();
        
        // Calculate positions for each kernel cell to corresponding input cell
        for (let kernelRow = 0; kernelRow < 3; kernelRow++) {
            for (let kernelCol = 0; kernelCol < 3; kernelCol++) {
                // Kernel cell position (center of cell)
                const kernelCellX = kernelRect.left - containerRect.left + (kernelCol * 62) + 31; // 60px cell + 2px gap
                const kernelCellY = kernelRect.top - containerRect.top + (kernelRow * 62) + 31;
                
                // Corresponding input cell position (center of cell)
                const inputCellX = inputRect.left - containerRect.left + ((this.currentCol + kernelCol) * 42) + 21; // 40px cell + 2px gap
                const inputCellY = inputRect.top - containerRect.top + ((this.currentRow + kernelRow) * 42) + 21;
                
                // Create dotted line
                const line = document.createElement('div');
                line.className = 'connection-line';
                
                // Calculate line properties
                const deltaX = inputCellX - kernelCellX;
                const deltaY = inputCellY - kernelCellY;
                const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                
                // Position and style the line
                line.style.left = `${kernelCellX}px`;
                line.style.top = `${kernelCellY}px`;
                line.style.width = `${length}px`;
                line.style.transform = `rotate(${angle}deg)`;
                
                linesContainer.appendChild(line);
            }
        }
    }

    // ...existing code...

    highlightInputRegion() {
        // Remove previous highlights
        document.querySelectorAll('.input-cell').forEach(cell => {
            cell.classList.remove('highlight');
        });
        
        // Add highlights to current kernel region
        for (let i = 0; i < this.kernelSize; i++) {
            for (let j = 0; j < this.kernelSize; j++) {
                const cell = document.getElementById(`input-${this.currentRow + i}-${this.currentCol + j}`);
                if (cell) {
                    cell.classList.add('highlight');
                }
            }
        }
    }

    updateOutputMatrix() {
        for (let i = 0; i < this.outputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                const cell = document.getElementById(`output-${i}-${j}`);
                cell.textContent = this.outputMatrix[i][j];
                
                if (this.outputMatrix[i][j] !== '-') {
                    cell.classList.add('filled');
                } else {
                    cell.classList.remove('filled');
                }
            }
        }
    }

    reset() {
        this.currentRow = 0;
        this.currentCol = 0;
        
        // Reset output matrix
        for (let i = 0; i < this.outputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.outputMatrix[i][j] = '-';
            }
        }
        
        // Clear calculation display
        document.getElementById('calculation-display').textContent = 'Move the kernel to see the calculation';
        
        this.updateDisplay();
    }

    randomizeData() {
        this.generateRandomData();
        this.createMatrices();
        this.currentRow = 0;
        this.currentCol = 0;
        
        // Clear calculation display
        document.getElementById('calculation-display').textContent = 'Move the kernel to see the calculation';
        
        this.updateDisplay();
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KernelFilteringDemo();
});
