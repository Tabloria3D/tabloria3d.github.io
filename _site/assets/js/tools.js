// Custom Size Pricing Calculator (Replication/Placeholder for interactive tools)

document.addEventListener('DOMContentLoaded', () => {
    const calcContainer = document.getElementById('calculator-container');
    
    if (calcContainer) {
        calcContainer.innerHTML = `
            <div class="col-span-1 md:col-span-3 text-left bg-primary/50 p-6 rounded-lg border border-gray-800">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Desired Height (cm)</label>
                        <input type="range" id="calc-height" min="10" max="100" value="30" class="w-full accent-accent">
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10cm</span>
                            <span id="height-val" class="text-white font-bold text-base">30 cm</span>
                            <span>100cm</span>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Complexity / Finish</label>
                        <select id="calc-finish" class="input-field py-2">
                            <option value="1">Standard (Single Color)</option>
                            <option value="1.5">Detailed (Basic Paint)</option>
                            <option value="2.5">Premium (Hand Painted)</option>
                        </select>
                    </div>
                </div>
                
                <div class="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <p class="text-gray-400 text-sm">Estimated Price:</p>
                        <p class="text-3xl font-display font-bold text-accent" id="calc-price">450 LE</p>
                    </div>
                    <button class="mt-4 md:mt-0 btn-primary" onclick="
                        const h = document.getElementById('height-val').innerText;
                        const f = document.getElementById('calc-finish').options[document.getElementById('calc-finish').selectedIndex].text;
                        const p = document.getElementById('calc-price').innerText;
                        document.getElementById('product').value = 'Custom Print';
                        document.getElementById('message').value = 'I would like a custom print.\\nHeight: ' + h + '\\nFinish: ' + f + '\\nEstimated Price: ' + p;
                        document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
                    ">Request This Custom Build</button>
                </div>
            </div>
        `;

        const heightInput = document.getElementById('calc-height');
        const heightVal = document.getElementById('height-val');
        const finishInput = document.getElementById('calc-finish');
        const priceDisplay = document.getElementById('calc-price');

        const calculatePrice = () => {
            const height = parseInt(heightInput.value);
            const finishMultiplier = parseFloat(finishInput.value);
            
            // Base price calculation (arbitrary formula for placeholder)
            // e.g. 10 LE per cm * multiplier
            const price = Math.round(height * 15 * finishMultiplier);
            
            heightVal.innerText = `${height} cm`;
            priceDisplay.innerText = `${price} LE`;
        };

        heightInput.addEventListener('input', calculatePrice);
        finishInput.addEventListener('change', calculatePrice);
        
        // Initial calc
        calculatePrice();
    }
});
