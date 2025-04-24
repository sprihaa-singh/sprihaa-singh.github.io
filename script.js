// Shared data for Linear, Jump, Binary Search
const searchList = ['A', 'B', 'C', 'D', 'E', 'F'];
const searchTarget = 'D';
const searchWidth = 700;
const searchHeight = 350;
const cardWidth = 80;
const cardHeight = 100;
const cardSpacing = 10;
const targetCardX = 20;
const listStartX = 120;
const cardY = 20;

// Initialize state variables
let linearState = null;
let jumpState = null;
let binaryState = null;
let customBinaryState = null;
let performanceState = null;

// In the initializeButtons function (near the top of script.js)
function initializeButtons() {
    // Linear Search
    d3.select('#linear-search .controls button:nth-child(1)') // Start Linear Search
      .on('click', startLinearSearch);
    d3.select('#linear-search .controls button:nth-child(2)') // Previous (←)
      .on('click', stepLinearSearchBackward);
    d3.select('#linear-search .controls button:nth-child(3)') // Next (→)
      .on('click', stepLinearSearchForward);

    // Jump Search - Make sure these selectors match your HTML structure
    d3.select('#jump-search .controls button:nth-child(1)') // Start Jump Search
      .on('click', startJumpSearch);
    d3.select('#jump-search .controls button:nth-child(2)') // Previous (←)
      .on('click', stepJumpSearchBackward);
    d3.select('#jump-search .controls button:nth-child(3)') // Next (→)
      .on('click', stepJumpSearchForward);

    // Binary Search
    d3.select('#binary-search .controls button:nth-child(1)') // Start Binary Search
      .on('click', startBinarySearch);
    d3.select('#binary-search .controls button:nth-child(2)') // Previous (←)
      .on('click', stepBinarySearchBackward);
    d3.select('#binary-search .controls button:nth-child(3)') // Next (→)
      .on('click', stepBinarySearchForward);

    // Custom Binary Search - note: there are labels and inputs before the buttons
    d3.select('#custom-binary-search .controls button:nth-of-type(1)') // Start Custom Binary Search
      .on('click', startCustomBinarySearch);
    d3.select('#custom-binary-search .controls button:nth-of-type(2)') // Previous (←)
      .on('click', stepCustomBinarySearchBackward)
      .attr('disabled', true); // Initially disabled
    d3.select('#custom-binary-search .controls button:nth-of-type(3)') // Next (→)
      .on('click', stepCustomBinarySearchForward)
      .attr('disabled', true); // Initially disabled

    // Performance Comparison
    d3.select('#performance-comparison .controls button:nth-child(1)') // Previous (←)
      .on('click', stepPerformanceComparisonBackward);
    d3.select('#performance-comparison .controls button:nth-child(2)') // Next (→)
      .on('click', stepPerformanceComparison);

    // Tree Representation
    d3.select('#tree-representation .controls button:nth-child(1)') // Start Tree Visualization
      .on('click', startTreeVisualization);
    d3.select('#tree-representation .controls button:nth-child(2)') // Previous (←)
      .on('click', stepTreeBackward);
    d3.select('#tree-representation .controls button:nth-child(3)') // Next (→)
      .on('click', stepTreeForward);
}

// Make sure this is called when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  
  // DIRECT EVENT LISTENER FOR CUSTOM TREE VISUALIZATION
  setTimeout(() => {
    console.log('Setting up direct event listener for custom tree visualization');
    const customTreeStartButton = document.querySelector('#custom-tree-visualization .controls button:not(.arrow-button)');
    console.log('Custom tree start button:', customTreeStartButton);
    
    if (customTreeStartButton) {
      customTreeStartButton.addEventListener('click', function() {
        console.log('Custom tree start button clicked!');
        startCustomTreeVisualization();
      });
    }
  }, 500); // Small delay to ensure DOM is fully loaded
  
  initializeButtons();
  initializePerformanceComparison();

  // Linear Search
  const linearSearchSection = document.getElementById('linear-search');
  linearSearchSection.querySelector('button').addEventListener('click', () => {
    startLinearSearch();
    renderLinearSearch();
  });
  linearSearchSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepLinearSearchBackward);
  linearSearchSection.querySelector('.arrow-button:nth-child(3)').addEventListener('click', stepLinearSearchForward);

  // Binary Search
  const binarySearchSection = document.getElementById('binary-search');
  binarySearchSection.querySelector('button').addEventListener('click', () => {
    startBinarySearch();
    renderBinarySearch();
  });
  binarySearchSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepBinarySearchBackward);
  binarySearchSection.querySelector('.arrow-button:nth-child(3)').addEventListener('click', stepBinarySearchForward);

  // Custom Binary Search
  const customBinarySearchSection = document.getElementById('custom-binary-search');
  customBinarySearchSection.querySelector('button').addEventListener('click', startCustomBinarySearch);
  customBinarySearchSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepCustomBinarySearchBackward);
  customBinarySearchSection.querySelector('.arrow-button:nth-child(3)').addEventListener('click', stepCustomBinarySearchForward);

  // Jump Search
  const jumpSearchSection = document.getElementById('jump-search');
  jumpSearchSection.querySelector('button').addEventListener('click', () => {
    startJumpSearch();
    renderJumpSearch();
  });
  jumpSearchSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepJumpSearchBackward);
  jumpSearchSection.querySelector('.arrow-button:nth-child(3)').addEventListener('click', stepJumpSearchForward);

  // Tree Representation
  const treeSection = document.getElementById('tree-representation');
  treeSection.querySelector('button').addEventListener('click', () => {
    startTreeVisualization();
  });
  treeSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepTreeBackward);
  treeSection.querySelector('.arrow-button:nth-child(3)').addEventListener('click', stepTreeForward);
  
  // Custom Tree Visualization
  const customTreeSection = document.getElementById('custom-tree-visualization');
  // Direct selector for the start button
  customTreeSection.querySelector('.controls button:not(.arrow-button)').addEventListener('click', startCustomTreeVisualization);
  customTreeSection.querySelector('.controls .arrow-button:nth-of-type(1)').addEventListener('click', stepCustomTreeBackward);
  customTreeSection.querySelector('.controls .arrow-button:nth-of-type(2)').addEventListener('click', stepCustomTreeForward);

  // Performance Comparison
  const performanceSection = document.getElementById('performance-comparison');
  performanceSection.querySelector('.arrow-button:nth-child(1)').addEventListener('click', stepPerformanceBackward);
  performanceSection.querySelector('.arrow-button:nth-child(2)').addEventListener('click', stepPerformanceForward);

  // Initialize performance comparison
  startPerformanceComparison();
});

// Linear Search
function startLinearSearch() {
    console.log('startLinearSearch called');
    linearState = {
        step: 0,
        currentIndex: -1,
        ruledOut: new Set(),
        found: false,
        isFinalStep: false,
        showFinalCards: false,
        comparisons: 0,
        finalComparisons: null,
        showComparison: false,    // Flag to control when to show comparisons
        lastComparedValue: null,  // Track the last compared value
        lastComparedIndex: null,  // Track the last compared index
        firstStep: true           // Flag to track if this is the first step
    };
    renderLinearSearch();
}

function stepLinearSearchForward() {
    if (!linearState || linearState.showFinalCards) return;
    
    // If we're showing a comparison, toggle to the next step without changing state
    if (linearState.showComparison) {
        linearState.showComparison = false;
        
        // Process the result of the comparison
        if (searchList[linearState.currentIndex] === searchTarget) {
            // Found the target
            linearState.found = true;
            linearState.isFinalStep = true;
            linearState.finalComparisons = linearState.comparisons;
            linearState.showFinalCards = true;
        } else {
            // Not found, rule out this card
            linearState.ruledOut.add(linearState.currentIndex);
            
            // If this card's value is greater than target, rule out all cards to the right
            if (searchList[linearState.currentIndex] > searchTarget) {
                for (let i = linearState.currentIndex + 1; i < searchList.length; i++) {
                    linearState.ruledOut.add(i);
                }
                linearState.isFinalStep = true;
                linearState.finalComparisons = linearState.comparisons;
            } else {
                // Move to next card
                linearState.currentIndex++;
                
                // If we've gone through all cards, show the final state
                if (linearState.currentIndex >= searchList.length) {
                    linearState.isFinalStep = true;
                    linearState.finalComparisons = linearState.comparisons;
                    linearState.showFinalCards = true;
                }
            }
        }
    }
    // First show the comparison, then on the next click perform the actual step
    else {
        if (linearState.currentIndex === -1) {
            // Just starting, move to the first card
            linearState.currentIndex = 0;
        } else if (linearState.currentIndex < searchList.length) {
            // Show comparison for current card
            linearState.comparisons++;
            linearState.lastComparedValue = searchList[linearState.currentIndex];
            linearState.lastComparedIndex = linearState.currentIndex;
            linearState.showComparison = true;
        } else {
            // We've gone through all cards, show the final state
            linearState.isFinalStep = true;
            linearState.finalComparisons = linearState.comparisons;
            linearState.showFinalCards = true;
        }
    }
    
    renderLinearSearch();
}

function stepLinearSearchBackward() {
    if (!linearState || (linearState.step <= 0 && !linearState.showComparison)) return;
    
    // If we're showing a comparison, just toggle it off
    if (linearState.showComparison) {
        linearState.showComparison = false;
        // Don't decrement the comparison counter when going backward
        // This ensures the count stays accurate
        renderLinearSearch();
        return;
    }
    
    linearState.step--;
    linearState.currentIndex--;
    linearState.comparisons--;
    linearState.found = false;
    linearState.isFinalStep = false;
    linearState.showFinalCards = false;
    linearState.finalComparisons = null;
    linearState.lastComparedValue = null;
    linearState.lastComparedIndex = null;
    linearState.ruledOut.delete(linearState.currentIndex + 1);
    renderLinearSearch();
}

function renderLinearSearch() {
    console.log('renderLinearSearch called', linearState);
    const svg = d3.select('#linear-search svg');
    svg.attr('width', searchWidth).attr('height', searchHeight);
    svg.selectAll('*').remove(); // Clear previous content

    // Enable/disable buttons
    d3.select('#linear-search .controls button:nth-child(2)') // Previous
      .attr('disabled', linearState && linearState.step === 0 && !linearState.showComparison ? true : null);
    d3.select('#linear-search .controls button:nth-child(3)') // Next
      .attr('disabled', linearState && linearState.showFinalCards ? true : null);

    // Update target card
    svg.selectAll('.target-group').remove();
    const targetGroup = svg.append('g').attr('class', 'target-group');
    targetGroup.append('rect')
      .attr('class', 'target-card')
      .attr('x', targetCardX)
      .attr('y', cardY)
      .attr('width', cardWidth)
      .attr('height', cardHeight);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight / 2)
      .attr('text-anchor', 'middle')
      .text(searchTarget);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight + 20)
      .attr('text-anchor', 'middle')
      .text(linearState && (linearState.found || linearState.isFinalStep || linearState.showFinalCards) ? searchList.indexOf(searchTarget) : '?');

    // Update list cards
    svg.selectAll('.list-group').remove();
    const listGroup = svg.append('g').attr('class', 'list-group');
    listGroup.selectAll('.element')
      .data(searchList)
      .enter()
      .append('rect')
      .attr('class', 'element')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing))
      .attr('y', cardY)
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('class', (d, i) => {
        if (linearState && linearState.showFinalCards && i === searchList.indexOf(searchTarget)) return 'target-card';
        if (linearState && linearState.currentIndex === i && !linearState.showFinalCards) return 'target-card';
        if (linearState && linearState.ruledOut.has(i)) return 'ruled-out';
        return 'unflipped';
      });

    // Card values
    listGroup.selectAll('.value')
      .data(searchList)
      .enter()
      .append('text')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
      .attr('y', cardY + cardHeight / 2)
      .attr('text-anchor', 'middle')
      .text((d, i) => {
        if (linearState && linearState.showFinalCards && i === searchList.indexOf(searchTarget)) return d;
        if (linearState && (linearState.currentIndex === i || linearState.ruledOut.has(i))) return d;
        return '';
      });

    // Indices
    listGroup.selectAll('.index')
      .data(searchList)
      .enter()
      .append('text')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
      .attr('y', cardY + cardHeight + 20)
      .attr('text-anchor', 'middle')
      .text((d, i) => i);

    // Update comparison arrow and text
    svg.selectAll('.comparison-group').remove();
    if (linearState && linearState.showComparison && linearState.lastComparedIndex >= 0) {
      const currentX = listStartX + linearState.lastComparedIndex * (cardWidth + cardSpacing) + cardWidth / 2;
      const comparisonGroup = svg.append('g').attr('class', 'comparison-group');
      comparisonGroup.append('rect')
        .attr('class', 'comparison-background')
        .attr('x', (targetCardX + cardWidth + currentX) / 2 - 50)
        .attr('y', cardY + cardHeight / 2 - 20)
        .attr('width', 100)
        .attr('height', 20);
      comparisonGroup.append('path')
        .attr('class', 'comparison-arrow')
        .attr('d', `M${targetCardX + cardWidth},${cardY + cardHeight / 2} L${currentX},${cardY + cardHeight / 2}`);
      
      // Add Target Found! message when target is found
      if (searchList[linearState.lastComparedIndex] === searchTarget) {
        svg.append('text')
          .attr('x', targetCardX + cardWidth / 2)
          .attr('y', cardY - 20)
          .attr('text-anchor', 'middle')
          .attr('font-size', '18px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'Arial, sans-serif')
          .attr('fill', '#3f51b5')  // Indigo color
          .text('Target Found!');
      }
      
      // Determine relational comparison for display
      let comparisonOperator;
      if (linearState.lastComparedValue === searchTarget) {
        comparisonOperator = '=';
      } else if (linearState.lastComparedValue > searchTarget) {
        comparisonOperator = '>';
      } else {
        comparisonOperator = '<';
      }
      
      comparisonGroup.append('text')
        .attr('x', (targetCardX + cardWidth + currentX) / 2)
        .attr('y', cardY + cardHeight / 2 - 5)
        .attr('text-anchor', 'middle')
        .text(`${searchTarget} ${comparisonOperator} ${linearState.lastComparedValue}`);
    }

    // Update percentage bar
    svg.selectAll('.bar-group').remove();
    const remaining = (linearState && (linearState.found || linearState.isFinalStep || linearState.showFinalCards)) ? 0 : linearState ? searchList.length - linearState.ruledOut.size : searchList.length;
    const percentage = (remaining / searchList.length) * 100;
    const barGroup = svg.append('g').attr('class', 'bar-group');
    barGroup.append('rect')
      .attr('class', 'percentage-background')
      .attr('x', targetCardX)
      .attr('y', cardY + cardHeight + 40)
      .attr('width', searchWidth - targetCardX - 20)
      .attr('height', 20);
    barGroup.append('rect')
      .attr('class', 'percentage-bar')
      .attr('x', targetCardX)
      .attr('y', cardY + cardHeight + 40)
      .attr('width', ((searchWidth - targetCardX - 20) * percentage) / 100)
      .attr('height', 20);
    barGroup.append('text')
      .attr('x', searchWidth / 2)
      .attr('y', cardY + cardHeight + 55)
      .attr('text-anchor', 'middle')
      .text(`${Math.round(percentage)}% Search Space Remaining`);

    // Update comparison counter
    svg.selectAll('.comparison-counter').remove();
    svg.append('text')
      .attr('class', 'comparison-counter')
      .attr('x', searchWidth / 2)
      .attr('y', cardY + cardHeight + 85)
      .attr('text-anchor', 'middle')
      .text(`Comparisons: ${linearState && linearState.finalComparisons !== null ? linearState.finalComparisons : linearState ? linearState.comparisons : 0}`);
}

// Binary Search
function startJumpSearch() {
    console.log('startJumpSearch called');
    jumpState = {
        currentIndex: 0,  // Start at first element immediately
        prevBlock: 0,
        currentBlock: 0,
        ruledOut: new Set(),
        comparisons: 0,
        found: false,
        phase: 'jump',  // Skip 'init' phase and go straight to jumping
        lastComparedValue: null, // Track the last compared value
        lastComparedIndex: null, // Track the last compared index
        showComparison: false    // Flag to control when to show comparisons
    };
    renderJumpSearch();
}

function stepJumpSearchForward() {
    if (!jumpState || jumpState.phase === 'done') return;
    
    const n = searchList.length;
    const blockSize = Math.floor(Math.sqrt(n));
    
    // If we're showing a comparison, toggle to the next step without changing state
    if (jumpState.showComparison) {
        jumpState.showComparison = false;
        
        // Grey out cards that are too large after a comparison
        const currentValue = searchList[jumpState.lastComparedIndex];
        if (currentValue > searchTarget) {
            // Grey out all cards from this index onwards as they are too large
            for (let i = jumpState.lastComparedIndex; i < n; i++) {
                jumpState.ruledOut.add(i);
            }
        }
        
        // Now actually perform the step based on the comparison
        if (jumpState.phase === 'jump') {
            if (jumpState.currentIndex >= n || searchList[jumpState.currentIndex] >= searchTarget) {
                jumpState.phase = 'linear';
                // Start linear search from previous block
                jumpState.currentIndex = jumpState.prevBlock;
                // Mark all elements before current block as ruled out
                for (let i = 0; i < jumpState.prevBlock; i++) {
                    jumpState.ruledOut.add(i);
                }
            } else {
                // Mark elements in previous block as ruled out
                for (let i = jumpState.prevBlock; i < jumpState.currentIndex; i++) {
                    jumpState.ruledOut.add(i);
                }
                jumpState.prevBlock = jumpState.currentIndex;
                jumpState.currentIndex = Math.min(jumpState.currentIndex + blockSize, n - 1);
            }
        } 
        else if (jumpState.phase === 'linear') {
            if (searchList[jumpState.currentIndex] === searchTarget) {
                jumpState.found = true;
                jumpState.phase = 'done';
            } 
            else if (jumpState.currentIndex >= Math.min(jumpState.prevBlock + blockSize, n - 1)) {
                jumpState.phase = 'done';
            } 
            else {
                jumpState.ruledOut.add(jumpState.currentIndex);
                jumpState.currentIndex++;
            }
        }
    }
    // First show the comparison, then on the next click perform the actual step
    else {
        jumpState.comparisons++;
        jumpState.lastComparedValue = searchList[jumpState.currentIndex];
        jumpState.lastComparedIndex = jumpState.currentIndex;
        jumpState.showComparison = true;
    }
    
    renderJumpSearch();
}

// Keep the rest of the functions (stepJumpSearchBackward and renderJumpSearch) the same as before
function startBinarySearch() {
  console.log('startBinarySearch called');
  binaryState = {
      currentStep: 0,
      steps: generateBinarySearchSteps(searchList, searchTarget),
      found: false,
      finalComparisons: null,
      showComparison: false,    // Flag to control when to show comparisons
      lastComparedValue: null,  // Track the last compared value
      lastComparedMid: null,    // Track the last compared mid index
      highlightOnly: false      // Flag to indicate we're just highlighting without comparison
  };
  renderBinarySearch();
}

function stepBinarySearchBackward() {
    if (!binaryState || (binaryState.currentStep <= 0 && !binaryState.showComparison && !binaryState.highlightOnly)) return;
    
    // If we're showing a comparison, just toggle it off
    if (binaryState.showComparison) {
        binaryState.showComparison = false;
        renderBinarySearch();
        return;
    }
    
    // If we're in highlight-only mode, just toggle it off
    if (binaryState.highlightOnly) {
        binaryState.highlightOnly = false;
        renderBinarySearch();
        return;
    }
    
    binaryState.currentStep--;
    binaryState.found = false;
    binaryState.finalComparisons = null;
    binaryState.lastComparedValue = null;
    renderBinarySearch();
}

function stepBinarySearchForward() {
    if (!binaryState || binaryState.currentStep >= binaryState.steps.length - 1) return;
    
    // If we're showing a comparison, toggle to the next step without changing state
    if (binaryState.showComparison) {
        binaryState.showComparison = false;
        
        // Now actually perform the step based on the comparison
        const current = binaryState.steps[binaryState.currentStep];
        const nextStep = binaryState.steps[binaryState.currentStep + 1];
        
        // Grey out cards based on comparison
        if (current.action === 'compare' && current.mid >= 0) {
            const midValue = searchList[current.mid];
            if (midValue > searchTarget) {
                // If the current value is greater than target, rule out this and all cards to the right
                for (let i = current.mid; i <= current.right; i++) {
                    nextStep.ruledOut.add(i);
                }
            } else if (midValue < searchTarget) {
                // If the current value is less than target, rule out this and all cards to the left
                for (let i = current.left; i <= current.mid; i++) {
                    nextStep.ruledOut.add(i);
                }
            }
        }
        
        binaryState.currentStep++;
        binaryState.highlightOnly = true; // Next step will be highlight only
        const newCurrent = binaryState.steps[binaryState.currentStep];
        if (newCurrent.action === 'compare' && newCurrent.mid >= 0 && searchList[newCurrent.mid] === searchTarget) {
            binaryState.found = true;
            binaryState.finalComparisons = newCurrent.comparisons;
        } else if (newCurrent.action === 'final') {
            binaryState.found = newCurrent.found;
            binaryState.finalComparisons = newCurrent.comparisons;
        }
    }
    // If we're in highlight-only mode, now show the comparison
    else if (binaryState.highlightOnly) {
        binaryState.highlightOnly = false;
        const current = binaryState.steps[binaryState.currentStep];
        
        // If it's a comparison step, prepare to show the comparison
        if (current.action === 'compare' && current.mid >= 0) {
            binaryState.lastComparedValue = searchList[current.mid];
            binaryState.lastComparedMid = current.mid;
            binaryState.showComparison = true;
        }
    }
    // First highlight the card (first step of two-step process)
    else {
        binaryState.currentStep++;
        binaryState.highlightOnly = true; // Just highlight, don't show comparison yet
    }
    
    renderBinarySearch();
}

function generateBinarySearchSteps(list, target) {
    const steps = [];
    let left = 0;
    let right = list.length - 1;
    let comparisons = 0;
    let ruledOut = new Set();

    // Initial step to show the starting state
    steps.push({
        action: 'init',
        left,
        right,
        mid: Math.floor((left + right) / 2),
        ruledOut: new Set(ruledOut),
        comparisons
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        comparisons++;
        
        // Add a comparison step
        steps.push({
            action: 'compare',
            left,
            right,
            mid,
            ruledOut: new Set(ruledOut),
            comparisons
        });

        if (list[mid] === target) {
            steps.push({
                action: 'final',
                left,
                right,
                mid,
                ruledOut: new Set(ruledOut),
                comparisons,
                found: true
            });
            return steps;
        } else if (list[mid] < target) {
            // Rule out left half including mid
            for (let i = left; i <= mid; i++) {
                ruledOut.add(i);
            }
            left = mid + 1;
        } else {
            // Rule out right half including mid
            for (let i = mid; i <= right; i++) {
                ruledOut.add(i);
            }
            right = mid - 1;
        }
    }

    steps.push({
        action: 'final',
        left,
        right,
        mid: -1,
        ruledOut: new Set(ruledOut),
        comparisons,
        found: false
    });

    return steps;
}

function renderBinarySearch() {
    console.log('renderBinarySearch called', binaryState);
    const svg = d3.select('#binary-search svg');
    svg.attr('width', searchWidth).attr('height', searchHeight);
    svg.selectAll('*').remove(); // Clear previous content

    // Enable/disable buttons
    d3.select('#binary-search .controls button:nth-child(2)') // Previous
      .attr('disabled', binaryState && binaryState.currentStep === 0 && !binaryState.showComparison ? true : null);
    d3.select('#binary-search .controls button:nth-child(3)') // Next
      .attr('disabled', binaryState && binaryState.currentStep === binaryState.steps.length - 1 ? true : null);

    if (!binaryState) return;
    const current = binaryState.steps[binaryState.currentStep];

    // Update target card
    svg.selectAll('.target-group').remove();
    const targetGroup = svg.append('g').attr('class', 'target-group');
    targetGroup.append('rect')
      .attr('class', 'target-card')
      .attr('x', targetCardX)
      .attr('y', cardY)
      .attr('width', cardWidth)
      .attr('height', cardHeight);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight / 2)
      .attr('text-anchor', 'middle')
      .text(searchTarget);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight + 20)
      .attr('text-anchor', 'middle')
      .text(current.action === 'final' && binaryState.found ? current.mid : current.action === 'final' ? 'Not found' : '?');
      
    // Add 'Target Found!' message when target is found
    if (binaryState.found) {
      svg.append('text')
        .attr('x', targetCardX + cardWidth / 2)
        .attr('y', cardY - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', '#3f51b5')  // Indigo color
        .text('Target Found!');
    }

    // Update list cards
    svg.selectAll('.list-group').remove();
    const listGroup = svg.append('g').attr('class', 'list-group');
    listGroup.selectAll('.element')
      .data(searchList)
      .enter()
      .append('rect')
      .attr('class', 'element')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing))
      .attr('y', cardY)
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('class', (d, i) => {
        if (current.action === 'final' && binaryState.found && i === searchList.indexOf(searchTarget)) return 'target-card';
        if (current.action === 'compare' && i === current.mid) return 'target-card';
        if (current.ruledOut.has(i)) return 'ruled-out';
        return 'unflipped';
      });

    // Card values
    listGroup.selectAll('.value')
      .data(searchList)
      .enter()
      .append('text')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
      .attr('y', cardY + cardHeight / 2)
      .attr('text-anchor', 'middle')
      .text((d, i) => (current.action === 'compare' && i === current.mid) || current.ruledOut.has(i) || (current.action === 'final' && binaryState.found && i === searchList.indexOf(searchTarget)) ? d : '');

    // Indices
    listGroup.selectAll('.index')
      .data(searchList)
      .enter()
      .append('text')
      .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
      .attr('y', cardY + cardHeight + 20)
      .attr('text-anchor', 'middle')
      .text((d, i) => i);

    // Labels for left, right, mid
    svg.selectAll('.label-group').remove();
    if (current.action !== 'final') {
      const { left, right, mid } = current;
      listGroup.selectAll('.element')
        .filter((d, i) => i === left)
        .attr('class', 'element left-outline');
      listGroup.selectAll('.element')
        .filter((d, i) => i === right)
        .attr('class', 'element right-outline');
      listGroup.selectAll('.element')
        .filter((d, i) => i === mid)
        .attr('class', current.action === 'compare' ? 'element target-card mid-outline' : 'element unflipped mid-outline');

      const labelsByIndex = {};
      if (left >= 0) {
        labelsByIndex[left] = labelsByIndex[left] || [];
        labelsByIndex[left].push({ text: 'left', color: '#2196F3' });
      }
      if (right >= 0) {
        labelsByIndex[right] = labelsByIndex[right] || [];
        labelsByIndex[right].push({ text: 'right', color: '#F44336' });
      }
      if (mid >= 0) {
        labelsByIndex[mid] = labelsByIndex[mid] || [];
        labelsByIndex[mid].push({ text: 'mid', color: '#9C27B0' });
      }

      const labelGroup = svg.append('g').attr('class', 'label-group');
      Object.keys(labelsByIndex).forEach(index => {
        const labels = labelsByIndex[index];
        labels.forEach((label, i) => {
          labelGroup.append('text')
            .attr('x', listStartX + Number(index) * (cardWidth + cardSpacing) + cardWidth / 2)
            .attr('y', cardY + cardHeight + 40 + (i * 20))
            .attr('text-anchor', 'middle')
            .attr('fill', label.color)
            .text(label.text);
        });
      });
    }

    // Update comparison arrow and text
    svg.selectAll('.comparison-group').remove();
    
    // ONLY show comparison when showComparison flag is true (for consistency)
    // Do NOT show comparison during compare step unless showComparison is true
    const showingComparison = binaryState.showComparison && binaryState.lastComparedValue !== null;
    
    if (showingComparison) {
      // Get the mid index from state
      const midIndex = binaryState.lastComparedMid;
      const currentX = listStartX + midIndex * (cardWidth + cardSpacing) + cardWidth / 2;
      const comparedValue = binaryState.lastComparedValue;
      
      const comparisonGroup = svg.append('g').attr('class', 'comparison-group');
      comparisonGroup.append('rect')
        .attr('class', 'comparison-background')
        .attr('x', (targetCardX + cardWidth + currentX) / 2 - 50)
        .attr('y', cardY + cardHeight / 2 - 20)
        .attr('width', 100)
        .attr('height', 20);
      comparisonGroup.append('path')
        .attr('class', 'comparison-arrow')
        .attr('d', `M${targetCardX + cardWidth},${cardY + cardHeight / 2} L${currentX},${cardY + cardHeight / 2}`);
      
      // Determine the comparison operator based on values
      let comparisonOperator;
      if (comparedValue === searchTarget) {
        comparisonOperator = '=';
      } else if (comparedValue > searchTarget) {
        comparisonOperator = '>';
      } else {
        comparisonOperator = '<';
      }
      
      comparisonGroup.append('text')
        .attr('x', (targetCardX + cardWidth + currentX) / 2)
        .attr('y', cardY + cardHeight / 2 - 5)
        .attr('text-anchor', 'middle')
        .text(`${searchTarget} ${comparisonOperator === '>' ? '<' : comparisonOperator === '<' ? '>' : '='} ${comparedValue}`);
    }

    // Update percentage bar
    svg.selectAll('.bar-group').remove();
    const remaining = current.action === 'final' ? 0 : current.right - current.left + 1;
    const percentage = (remaining / searchList.length) * 100;
    const barGroup = svg.append('g').attr('class', 'bar-group');
    barGroup.append('rect')
      .attr('class', 'percentage-background')
      .attr('x', targetCardX)
      .attr('y', cardY + cardHeight + 100)
      .attr('width', searchWidth - targetCardX - 20)
      .attr('height', 20);
    barGroup.append('rect')
      .attr('class', 'percentage-bar')
      .attr('x', targetCardX)
      .attr('y', cardY + cardHeight + 100)
      .attr('width', ((searchWidth - targetCardX - 20) * percentage) / 100)
      .attr('height', 20);
    barGroup.append('text')
      .attr('x', searchWidth / 2)
      .attr('y', cardY + cardHeight + 115)
      .attr('text-anchor', 'middle')
      .text(`${Math.round(percentage)}% Search Space Remaining`);

    // Update comparison counter
    svg.selectAll('.comparison-counter').remove();
    svg.append('text')
      .attr('class', 'comparison-counter')
      .attr('x', searchWidth / 2)
      .attr('y', cardY + cardHeight + 145)
      .attr('text-anchor', 'middle')
      .text(`Comparisons: ${binaryState.finalComparisons !== null ? binaryState.finalComparisons : current.comparisons}`);
}

// Custom Binary Search
function startCustomBinarySearch() {
    console.log('startCustomBinarySearch called');
    const listInput = document.getElementById('custom-list').value;
    const targetInput = document.getElementById('custom-target').value;
    const errorElement = document.getElementById('custom-error');

    if (!listInput || !targetInput) {
        errorElement.textContent = 'Please enter a sorted list and a target number.';
        return;
    }

    const numbers = listInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const target = parseInt(targetInput.trim());

    if (numbers.length === 0 || isNaN(target)) {
        errorElement.textContent = 'Invalid input. Please enter numbers correctly.';
        return;
    }

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < numbers[i - 1]) {
            errorElement.textContent = 'List must be sorted in ascending order.';
            return;
        }
    }

    errorElement.textContent = '';
    console.log('Creating custom binary search with:', numbers, target);
    
    customBinaryState = {
        numbers,
        target,
        currentStep: 0,
        steps: [],  // Initialize empty first
        found: false,
        finalComparisons: null,
        showComparison: false,    // Flag to control when to show comparisons
        lastComparedValue: null,  // Track the last compared value
        lastComparedMid: null,    // Track the last compared mid index
        highlightOnly: false      // Flag to indicate we're just highlighting without comparison
    };
    
    // Generate steps after initializing state
    customBinaryState.steps = generateBinarySearchSteps(numbers, target);
    
    console.log('Custom Binary Steps:', customBinaryState.steps.length, customBinaryState.steps);
    
    // Make sure buttons are properly initialized
    d3.select('#custom-binary-search .controls button:nth-of-type(2)') // Previous
      .attr('disabled', true);
    d3.select('#custom-binary-search .controls button:nth-of-type(3)') // Next
      .attr('disabled', false); // Enable next button unconditionally
      
    renderCustomBinarySearch();
}

function stepCustomBinarySearchForward() {
    if (!customBinaryState || customBinaryState.currentStep >= customBinaryState.steps.length - 1) return;
    
    // If we're showing a comparison, toggle to the next step without changing state
    if (customBinaryState.showComparison) {
        customBinaryState.showComparison = false;
        
        // Now actually perform the step based on the comparison
        const current = customBinaryState.steps[customBinaryState.currentStep];
        const nextStep = customBinaryState.steps[customBinaryState.currentStep + 1];
        
        // Grey out cards based on comparison
        if (current.action === 'compare' && current.mid >= 0) {
            const midValue = customBinaryState.numbers[current.mid];
            if (midValue > customBinaryState.target) {
                // If the current value is greater than target, rule out this and all cards to the right
                for (let i = current.mid; i <= current.right; i++) {
                    nextStep.ruledOut.add(i);
                }
            } else if (midValue < customBinaryState.target) {
                // If the current value is less than target, rule out this and all cards to the left
                for (let i = current.left; i <= current.mid; i++) {
                    nextStep.ruledOut.add(i);
                }
            }
        }
        
        customBinaryState.currentStep++;
        customBinaryState.highlightOnly = true; // Next step will be highlight only
        const newCurrent = customBinaryState.steps[customBinaryState.currentStep];
        if (newCurrent.action === 'compare' && newCurrent.mid >= 0 && customBinaryState.numbers[newCurrent.mid] === customBinaryState.target) {
            customBinaryState.found = true;
            customBinaryState.finalComparisons = newCurrent.comparisons;
        } else if (newCurrent.action === 'final') {
            customBinaryState.found = newCurrent.found;
            customBinaryState.finalComparisons = newCurrent.comparisons;
        }
    }
    // If we're in highlight-only mode, now show the comparison
    else if (customBinaryState.highlightOnly) {
        customBinaryState.highlightOnly = false;
        const current = customBinaryState.steps[customBinaryState.currentStep];
        
        // If it's a comparison step, prepare to show the comparison
        if (current.action === 'compare' && current.mid >= 0) {
            customBinaryState.lastComparedValue = customBinaryState.numbers[current.mid];
            customBinaryState.lastComparedMid = current.mid;
            customBinaryState.showComparison = true;
        }
    }
    // First highlight the card (first step of two-step process)
    else {
        customBinaryState.currentStep++;
        customBinaryState.highlightOnly = true; // Just highlight, don't show comparison yet
    }
    
    renderCustomBinarySearch();
}

function stepCustomBinarySearchBackward() {
    if (!customBinaryState || (customBinaryState.currentStep <= 0 && !customBinaryState.showComparison && !customBinaryState.highlightOnly)) return;
    
    // If we're showing a comparison, just toggle it off
    if (customBinaryState.showComparison) {
        customBinaryState.showComparison = false;
        renderCustomBinarySearch();
        return;
    }
    
    // If we're in highlight-only mode, just toggle it off
    if (customBinaryState.highlightOnly) {
        customBinaryState.highlightOnly = false;
        renderCustomBinarySearch();
        return;
    }
    
    customBinaryState.currentStep--;
    customBinaryState.found = false;
    customBinaryState.finalComparisons = null;
    customBinaryState.lastComparedValue = null;
    customBinaryState.lastComparedMid = null;
    renderCustomBinarySearch();
}

function renderCustomBinarySearch() {
    console.log('renderCustomBinarySearch called', customBinaryState);
    const svg = d3.select('#custom-binary-search svg');
    svg.selectAll('*').remove();
    
    // Enable/disable buttons
    d3.select('#custom-binary-search .controls button:nth-of-type(2)') // Previous
      .attr('disabled', customBinaryState.currentStep === 0 && !customBinaryState.showComparison ? true : null);
    d3.select('#custom-binary-search .controls button:nth-of-type(3)') // Next
      .attr('disabled', customBinaryState.currentStep === customBinaryState.steps.length - 1 ? true : null);

    if (!customBinaryState) return;
    
    const numbers = customBinaryState.numbers;
    const target = customBinaryState.target;
    const current = customBinaryState.steps[customBinaryState.currentStep];

    // Calculate SVG dimensions
    const margin = 20;
    const containerWidth = Math.min(window.innerWidth - 4 * margin, 1200 - 4 * margin);
    const elementsPerRow = Math.floor((containerWidth - listStartX) / (cardWidth + cardSpacing));
    const numRows = Math.ceil(numbers.length / elementsPerRow);
    const svgWidth = Math.min(containerWidth, listStartX + numbers.length * (cardWidth + cardSpacing) + margin);
    const svgHeight = cardY + numRows * (cardHeight + 60) + 100 + 45;

    svg.attr('width', svgWidth).attr('height', svgHeight);

    // Buttons are already enabled/disabled at the beginning of the function

    // Target card
    const targetGroup = svg.append('g').attr('class', 'target-group');
    targetGroup.append('rect')
      .attr('class', 'target-card')
      .attr('x', targetCardX)
      .attr('y', cardY)
      .attr('width', cardWidth)
      .attr('height', cardHeight);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight / 2)
      .attr('text-anchor', 'middle')
      .text(target);
    targetGroup.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY + cardHeight + 20)
      .attr('text-anchor', 'middle')
      .text(current.action === 'final' && customBinaryState.found ? current.mid : current.action === 'final' ? 'Not found' : '?');

    // List cards
    const listGroup = svg.append('g').attr('class', 'list-group');
    listGroup.selectAll('.element')
      .data(numbers)
      .enter()
      .append('rect')
      .attr('class', 'element')
      .attr('x', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        const col = i % elementsPerRow;
        return listStartX + col * (cardWidth + cardSpacing);
      })
      .attr('y', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        return cardY + row * (cardHeight + 60);
      })
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('class', (d, i) => {
        if (current.action === 'final' && customBinaryState.found && numbers[i] === target) return 'target-card';
        if (current.action === 'compare' && i === current.mid) return 'target-card';
        if (current.ruledOut.has(i)) return 'ruled-out';
        return 'unflipped';
      });

    // Card values
    listGroup.selectAll('.value')
      .data(numbers)
      .enter()
      .append('text')
      .attr('x', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        const col = i % elementsPerRow;
        return listStartX + col * (cardWidth + cardSpacing) + cardWidth / 2;
      })
      .attr('y', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        return cardY + row * (cardHeight + 60) + cardHeight / 2;
      })
      .attr('text-anchor', 'middle')
      .text((d, i) => (current.action === 'compare' && i === current.mid) || current.ruledOut.has(i) || (current.action === 'final' && customBinaryState.found && numbers[i] === target) ? d : '');

    // Indices
    listGroup.selectAll('.index')
      .data(numbers)
      .enter()
      .append('text')
      .attr('x', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        const col = i % elementsPerRow;
        return listStartX + col * (cardWidth + cardSpacing) + cardWidth / 2;
      })
      .attr('y', (d, i) => {
        const row = Math.floor(i / elementsPerRow);
        return cardY + row * (cardHeight + 60) + cardHeight + 20;
      })
      .attr('text-anchor', 'middle')
      .text((d, i) => i);

    // Labels for left, right, mid
    svg.selectAll('.label-group').remove();
    if (current.action !== 'final') {
      const { left, right, mid } = current;
      listGroup.selectAll('.element')
        .filter((d, i) => i === left)
        .attr('class', 'element left-outline');
      listGroup.selectAll('.element')
        .filter((d, i) => i === right)
        .attr('class', 'element right-outline');
      listGroup.selectAll('.element')
        .filter((d, i) => i === mid)
        .attr('class', current.action === 'compare' ? 'element target-card mid-outline' : 'element unflipped mid-outline');

      const labelsByIndex = {};
      if (left >= 0) {
        labelsByIndex[left] = labelsByIndex[left] || [];
        labelsByIndex[left].push({ text: 'left', color: '#2196F3' });
      }
      if (right >= 0) {
        labelsByIndex[right] = labelsByIndex[right] || [];
        labelsByIndex[right].push({ text: 'right', color: '#F44336' });
      }
      if (mid >= 0) {
        labelsByIndex[mid] = labelsByIndex[mid] || [];
        labelsByIndex[mid].push({ text: 'mid', color: '#9C27B0' });
      }

      const labelGroup = svg.append('g').attr('class', 'label-group');
      Object.keys(labelsByIndex).forEach(index => {
        const labels = labelsByIndex[index];
        const i = Number(index);
        const row = Math.floor(i / elementsPerRow);
        const col = i % elementsPerRow;
        labels.forEach((label, j) => {
          labelGroup.append('text')
            .attr('x', listStartX + col * (cardWidth + cardSpacing) + cardWidth / 2)
            .attr('y', cardY + row * (cardHeight + 60) + cardHeight + 40 + (j * 20))
            .attr('text-anchor', 'middle')
            .attr('fill', label.color)
            .text(label.text);
        });
      });
    }

    // Update comparison arrow and text
    svg.selectAll('.comparison-group').remove();
    
    // ONLY show comparison when showComparison flag is true (for consistency)
    // Do NOT show comparison during compare step unless showComparison is true
    const showingComparison = customBinaryState.showComparison && customBinaryState.lastComparedValue !== null;
    
    if (showingComparison) {
      // Get the mid index from state
      const midIndex = customBinaryState.lastComparedMid;
      const row = Math.floor(midIndex / elementsPerRow);
      const col = midIndex % elementsPerRow;
      const currentX = listStartX + col * (cardWidth + cardSpacing) + cardWidth / 2;
      const currentY = cardY + row * (cardHeight + 60) + cardHeight / 2;
      const comparedValue = customBinaryState.lastComparedValue;
      
      const comparisonGroup = svg.append('g').attr('class', 'comparison-group');
      comparisonGroup.append('rect')
        .attr('class', 'comparison-background')
        .attr('x', (targetCardX + cardWidth + currentX) / 2 - 50)
        .attr('y', (cardY + cardHeight / 2 + currentY) / 2 - 20)
        .attr('width', 100)
        .attr('height', 20);
      comparisonGroup.append('path')
        .attr('class', 'comparison-arrow')
        .attr('d', `M${targetCardX + cardWidth},${cardY + cardHeight / 2} L${currentX},${currentY}`);
      
      // Determine the comparison operator based on values
      let comparisonOperator;
      if (comparedValue === target) {
        comparisonOperator = '=';
      } else if (comparedValue > target) {
        comparisonOperator = '>';
      } else {
        comparisonOperator = '<';
      }
      
      comparisonGroup.append('text')
        .attr('x', (targetCardX + cardWidth + currentX) / 2)
        .attr('y', (cardY + cardHeight / 2 + currentY) / 2 - 5)
        .attr('text-anchor', 'middle')
        .text(`${target} ${comparisonOperator === '>' ? '<' : comparisonOperator === '<' ? '>' : '='} ${comparedValue}`);
    }

    // Update percentage bar
    svg.selectAll('.bar-group').remove();
    const remaining = (current.action === 'final') ? 0 : current.right - current.left + 1;
    const percentage = (remaining / numbers.length) * 100;
    const barGroup = svg.append('g').attr('class', 'bar-group');
    barGroup.append('rect')
      .attr('class', 'percentage-background')
      .attr('x', targetCardX)
      .attr('y', cardY + (numRows - 1) * (cardHeight + 60) + cardHeight + 100)
      .attr('width', svgWidth - targetCardX - 20)
      .attr('height', 20);
    barGroup.append('rect')
      .attr('class', 'percentage-bar')
      .attr('x', targetCardX)
      .attr('y', cardY + (numRows - 1) * (cardHeight + 60) + cardHeight + 100)
      .attr('width', ((svgWidth - targetCardX - 20) * percentage) / 100)
      .attr('height', 20);
    barGroup.append('text')
      .attr('x', svgWidth / 2)
      .attr('y', cardY + (numRows - 1) * (cardHeight + 60) + cardHeight + 115)
      .attr('text-anchor', 'middle')
      .text(`${Math.round(percentage)}% Search Space Remaining`);

    // Update comparison counter
    svg.selectAll('.comparison-counter').remove();
    svg.append('text')
      .attr('class', 'comparison-counter')
      .attr('x', svgWidth / 2)
      .attr('y', cardY + (numRows - 1) * (cardHeight + 60) + cardHeight + 145)
      .attr('text-anchor', 'middle')
      .text(`Comparisons: ${customBinaryState.finalComparisons !== null ? customBinaryState.finalComparisons : current.comparisons}`);
}

// Performance Comparison
function initializePerformanceComparison() {
    console.log('initializePerformanceComparison called');
    performanceState = {
        step: -1,
        data: [
            { size: 10, linear: 10, jump: 4, binary: 4 },
            { size: 100, linear: 100, jump: 14, binary: 7 },
            { size: 1000, linear: 1000, jump: 44, binary: 10 }
        ]
    };
    renderPerformanceComparison();
}

function stepPerformanceComparison() {
    if (!performanceState || performanceState.step >= 2) return;
    performanceState.step++;
    renderPerformanceComparison();
}

function stepPerformanceComparisonBackward() {
    if (!performanceState || performanceState.step <= -1) return;
    performanceState.step--;
    renderPerformanceComparison();
}

function renderPerformanceComparison() {
    console.log('renderPerformanceComparison called', performanceState);
    const svg = d3.select('#performance-comparison svg');
    svg.selectAll('*').remove();
    svg.attr('width', 700).attr('height', 350);

    // Enable/disable buttons
    d3.select('#performance-comparison .controls button:nth-child(1)') // Previous
      .attr('disabled', performanceState && performanceState.step === -1 ? true : null);
    d3.select('#performance-comparison .controls button:nth-child(2)') // Next
      .attr('disabled', performanceState && performanceState.step === 2 ? true : null);

    // Legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(500, 20)');
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#5C6BC0');
    legend.append('text')
      .attr('x', 25)
      .attr('y', 15)
      .text('Linear Search');
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 25)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#7986CB');
    legend.append('text')
      .attr('x', 25)
      .attr('y', 40)
      .text('Jump Search');
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 50)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#4C566A');
    legend.append('text')
      .attr('x', 25)
      .attr('y', 65)
      .text('Binary Search');

    if (performanceState.step < 0) return;

    const currentData = performanceState.data.slice(0, performanceState.step + 1);
    const maxY = performanceState.step === 0 ? 10 : performanceState.step === 1 ? 100 : 1000;
    const totalWidth = 500;
    const bandWidth = totalWidth / currentData.length;

    const x = d3.scaleBand()
      .domain(currentData.map(d => d.size))
      .range([50, 50 + totalWidth])
      .padding(0);
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([300, 50]);

    // Static bars
    const allData = performanceState.data.slice(0, performanceState.step);
    svg.selectAll('.bar-linear-static')
      .data(allData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-linear-static')
      .attr('x', d => x(d.size))
      .attr('y', d => y(d.linear))
      .attr('width', bandWidth / 3)
      .attr('height', d => 300 - y(d.linear))
      .attr('fill', '#5C6BC0');
    svg.selectAll('.bar-jump-static')
      .data(allData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-jump-static')
      .attr('x', d => x(d.size) + bandWidth / 3)
      .attr('y', d => y(d.jump))
      .attr('width', bandWidth / 3)
      .attr('height', d => 300 - y(d.jump))
      .attr('fill', '#7986CB');
    svg.selectAll('.bar-binary-static')
      .data(allData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-binary-static')
      .attr('x', d => x(d.size) + 2 * bandWidth / 3)
      .attr('y', d => y(d.binary))
      .attr('width', bandWidth / 3)
      .attr('height', d => 300 - y(d.binary))
      .attr('fill', '#4C566A');

    // New bars with transition
    const newData = performanceState.step >= 0 ? [performanceState.data[performanceState.step]] : [];
    svg.selectAll('.bar-linear')
      .data(newData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-linear')
      .attr('x', d => x(d.size))
      .attr('y', y(0))
      .attr('width', bandWidth / 3)
      .attr('height', 0)
      .attr('fill', '#5C6BC0')
      .transition()
      .duration(750)
      .attr('y', d => y(d.linear))
      .attr('height', d => 300 - y(d.linear));

    svg.selectAll('.bar-jump')
      .data(newData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-jump')
      .attr('x', d => x(d.size) + bandWidth / 3)
      .attr('y', y(0))
      .attr('width', bandWidth / 3)
      .attr('height', 0)
      .attr('fill', '#7986CB')
      .transition()
      .duration(750)
      .attr('y', d => y(d.jump))
      .attr('height', d => 300 - y(d.jump));

    svg.selectAll('.bar-binary')
      .data(newData, d => d.size)
      .enter()
      .append('rect')
      .attr('class', 'bar-binary')
      .attr('x', d => x(d.size) + 2 * bandWidth / 3)
      .attr('y', y(0))
      .attr('width', bandWidth / 3)
      .attr('height', 0)
      .attr('fill', '#4C566A')
      .transition()
      .duration(750)
      .attr('y', d => y(d.binary))
      .attr('height', d => 300 - y(d.binary));

    // X-Axis
    svg.selectAll('.x-axis')
      .data([currentData])
      .enter()
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, 300)')
      .call(d3.axisBottom(x))
      .merge(svg.select('.x-axis'))
      .transition()
      .duration(750)
      .call(d3.axisBottom(x));
    svg.select('.x-axis')
      .selectAll('.label')
      .data([null])
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', 50 + totalWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .text('List Size');

    // Y-Axis
    svg.selectAll('.y-axis')
      .data([maxY])
      .enter()
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(50, 0)')
      .call(d3.axisLeft(y))
      .merge(svg.select('.y-axis'))
      .transition()
      .duration(750)
      .call(d3.axisLeft(y));
    svg.select('.y-axis')
      .selectAll('.label')
      .data([null])
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -150)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .text('Steps');
}
// Tree Representation
const treeList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const treeTarget = 'F';
const treeCardWidth = 40;
const treeCardHeight = 40;
const treeCardSpacing = 10;
const treeCardY = 40;

// Custom Tree Visualization
let customTreeList = [];
let customTreeTarget = '';
let customTreeState = null;
const customTreeCardWidth = 40;
const customTreeCardHeight = 40;
const customTreeCardSpacing = 10;
const customTreeCardY = 40;

// Global debug functions accessible from the console
window.debugCustomTree = {
  step: function() {
    console.log('Manual step through debugCustomTree.step()');
    stepCustomTreeForward();
  },
  reset: function() {
    console.log('Resetting custom tree visualization');
    customTreeState = null;
  },
  state: function() {
    console.log('Current custom tree state:', customTreeState);
    return customTreeState;
  }
};

// Function to start custom tree visualization
function startCustomTreeVisualization() {
  console.log('startCustomTreeVisualization function called');
  // Get user input
  const listInput = document.getElementById('custom-tree-list').value;
  console.log('List input:', listInput);
  const targetInput = document.getElementById('custom-tree-target').value;
  console.log('Target input:', targetInput);
  const errorElement = document.getElementById('custom-tree-error');
  console.log('Error element:', errorElement);
  
  // Validate inputs
  try {
    // Parse list input
    customTreeList = listInput.split(',').map(item => {
      const num = Number(item.trim());
      if (isNaN(num)) throw new Error('List must contain only numbers');
      return num;
    });
    
    // Check if list is sorted
    for (let i = 1; i < customTreeList.length; i++) {
      if (customTreeList[i] < customTreeList[i-1]) {
        throw new Error('List must be sorted in ascending order');
      }
    }
    
    // Parse target input
    customTreeTarget = Number(targetInput.trim());
    if (isNaN(customTreeTarget)) throw new Error('Target must be a number');
    
    // Clear any previous error
    errorElement.textContent = '';
    
    // Initialize tree state
    customTreeState = {
      step: 0,
      nodes: [],
      links: [],
      searchPath: [],
      currentNode: null,
      currentNodeIndex: -1,
      left: 0,
      right: customTreeList.length - 1,
      mid: Math.floor((0 + customTreeList.length - 1) / 2),
      comparisons: 0,
      finalComparisons: null,
      comparison: '',
      conclusion: ''
    };
    
    // Generate steps for building and searching the tree
    customTreeState.steps = generateCustomTreeSteps(customTreeList, customTreeTarget);
    
    // Render the visualization
    renderCustomTreeVisualization();
    console.log('Visualization rendered');
  } catch (error) {
    // Display error message
    errorElement.textContent = error.message;
    console.error('Error in startCustomTreeVisualization:', error);
  }
}

// Function to generate steps for custom tree visualization
function generateCustomTreeSteps(list, target) {
  const steps = [];
  console.log('Generating steps for list:', list, 'and target:', target);
  
  // Create a simplified tree structure (non-recursive to avoid potential issues)
  function buildTreeIterative(list) {
    if (!list || list.length === 0) return [];
    
    const treeSteps = [];
    
    // Start with the root (middle of the whole array)
    const rootMid = Math.floor((0 + list.length - 1) / 2);
    const rootNode = { 
      name: String(list[rootMid]), 
      index: rootMid, 
      parent: null,
      depth: 0
    };
    
    // First step is to add the root node
    treeSteps.push({
      action: 'addNode',
      node: rootNode,
      left: 0,
      right: list.length - 1,
      mid: rootMid
    });
    
    // Use a queue to process nodes in a breadth-first manner
    const queue = [
      { node: rootNode, left: 0, right: list.length - 1, mid: rootMid }
    ];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const { node, left, right, mid } = current;
      
      // Process left child if there are elements on the left
      if (left < mid) {
        const leftMid = Math.floor((left + (mid - 1)) / 2);
        const leftNode = { 
          name: String(list[leftMid]), 
          index: leftMid, 
          parent: node.name,
          depth: node.depth + 1
        };
        
        // Add the left node
        treeSteps.push({
          action: 'addNode',
          node: leftNode,
          left: left,
          right: mid - 1,
          mid: leftMid
        });
        
        // Add the link from parent to left child
        treeSteps.push({
          action: 'addLink',
          source: node.name,
          target: leftNode.name,
          left: left,
          right: mid - 1,
          mid: leftMid
        });
        
        // Add left child to the queue for further processing
        queue.push({ node: leftNode, left: left, right: mid - 1, mid: leftMid });
      }
      
      // Process right child if there are elements on the right
      if (mid < right) {
        const rightMid = Math.floor(((mid + 1) + right) / 2);
        const rightNode = { 
          name: String(list[rightMid]), 
          index: rightMid, 
          parent: node.name,
          depth: node.depth + 1
        };
        
        // Add the right node
        treeSteps.push({
          action: 'addNode',
          node: rightNode,
          left: mid + 1,
          right: right,
          mid: rightMid
        });
        
        // Add the link from parent to right child
        treeSteps.push({
          action: 'addLink',
          source: node.name,
          target: rightNode.name,
          left: mid + 1,
          right: right,
          mid: rightMid
        });
        
        // Add right child to the queue for further processing
        queue.push({ node: rightNode, left: mid + 1, right: right, mid: rightMid });
      }
    }
    
    return treeSteps;
  }
  
  // Generate tree building steps iteratively
  const treeSteps = buildTreeIterative(list);
  steps.push(...treeSteps);
  
  console.log(`Generated ${treeSteps.length} tree building steps`);
  
  // Add search steps
  let left = 0;
  let right = list.length - 1;
  
  const searchSteps = [];
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = target === list[mid] ? '=' : (target < list[mid] ? '<' : '>');
    let conclusion = '';
    
    if (comparison === '=') {
      conclusion = 'Target found!';
    } else if (comparison === '<') {
      conclusion = 'Go left';
      right = mid - 1;
    } else {
      conclusion = 'Go right';
      left = mid + 1;
    }
    
    searchSteps.push({
      action: 'search',
      node: String(list[mid]),
      left: left,
      right: right,
      mid: mid,
      comparison: `${target} ${comparison} ${list[mid]}`,
      conclusion: conclusion
    });
    
    if (conclusion === 'Target found!') break;
  }
  
  steps.push(...searchSteps);
  console.log(`Generated ${searchSteps.length} search steps`);
  console.log('Total steps:', steps.length);
  
  return steps;
}

// Function to step forward in custom tree visualization
function stepCustomTreeForward() {
  console.log('stepCustomTreeForward called');
  
  if (!customTreeState) {
    console.error('customTreeState is null or undefined');
    return;
  }
  
  if (customTreeState.step >= customTreeState.steps.length) {
    console.log('Already at the last step');
    return;
  }
  
  const currentStep = customTreeState.steps[customTreeState.step];
  console.log('Current step:', currentStep);
  
  if (currentStep.action === 'addNode') {
    console.log('Adding node:', currentStep.node);
    customTreeState.nodes.push(currentStep.node);
  } else if (currentStep.action === 'addLink') {
    console.log('Adding link:', currentStep.source, 'to', currentStep.target);
    const sourceNode = customTreeState.nodes.find(n => n.name === currentStep.source);
    const targetNode = customTreeState.nodes.find(n => n.name === currentStep.target);
    
    if (sourceNode && targetNode) {
      customTreeState.links.push({
        source: sourceNode,
        target: targetNode
      });
    } else {
      console.error('Could not find source or target node for link');
    }
  } else if (currentStep.action === 'search') {
    console.log('Performing search step');
    // Reset comparisons at the start of search phase
    if (customTreeState.step === customTreeState.steps.findIndex(s => s.action === 'search')) {
      customTreeState.comparisons = 0;
    }
    
    customTreeState.currentNode = currentStep.node;
    
    // Find and set the index of the current node
    const nodeObj = customTreeState.nodes.find(n => n.name === customTreeState.currentNode);
    if (nodeObj) {
      customTreeState.currentNodeIndex = nodeObj.index;
    } else {
      console.warn('Could not find node object for current node:', currentStep.node);
    }
    
    customTreeState.searchPath.push(currentStep.node);
    if (customTreeState.finalComparisons === null) {
      customTreeState.comparisons++;
    }
    
    customTreeState.comparison = currentStep.comparison;
    customTreeState.conclusion = currentStep.conclusion;
    
    if (currentStep.conclusion === 'Target found!') {
      customTreeState.finalComparisons = customTreeState.comparisons;
    }
  }
  
  customTreeState.left = currentStep.left;
  customTreeState.right = currentStep.right;
  customTreeState.mid = currentStep.mid;
  customTreeState.step++;
  
  console.log('Updated customTreeState:', {
    step: customTreeState.step,
    nodes: customTreeState.nodes.length,
    links: customTreeState.links.length,
    currentNode: customTreeState.currentNode
  });
  
  renderCustomTreeVisualization();
}

// Function to step backward in custom tree visualization
function stepCustomTreeBackward() {
  if (!customTreeState || customTreeState.step <= 0) return;
  customTreeState.step--;
  const currentStep = customTreeState.steps[customTreeState.step];
  
  if (currentStep.action === 'addNode') {
    customTreeState.nodes.pop();
  } else if (currentStep.action === 'addLink') {
    customTreeState.links.pop();
  } else if (currentStep.action === 'search') {
    customTreeState.searchPath.pop();
    customTreeState.currentNode = customTreeState.searchPath[customTreeState.searchPath.length - 1] || null;
    customTreeState.comparison = customTreeState.step > 0 && customTreeState.steps[customTreeState.step - 1].comparison ? 
      customTreeState.steps[customTreeState.step - 1].comparison : '';
    customTreeState.conclusion = customTreeState.step > 0 && customTreeState.steps[customTreeState.step - 1].conclusion ? 
      customTreeState.steps[customTreeState.step - 1].conclusion : '';
    
    if (customTreeState.finalComparisons !== null) {
      customTreeState.comparisons--;
      customTreeState.finalComparisons = null;
    }
  }
  
  customTreeState.left = currentStep.left;
  customTreeState.right = currentStep.right;
  customTreeState.mid = currentStep.mid;
  
  renderCustomTreeVisualization();
}

// Function to render custom tree visualization
function renderCustomTreeVisualization() {
  if (!customTreeState) return;
  
  const svg = d3.select('#custom-tree-visualization svg');
  svg.selectAll('*').remove();
  
  // Set SVG dimensions
  const containerWidth = 900;
  const width = Math.min(containerWidth - 2 * margin, 800);
  const height = 450;
  svg.attr('width', width).attr('height', height);
  
  // Enable/disable buttons
  try {
    const customTreeSection = document.getElementById('custom-tree-visualization');
    const backButton = customTreeSection.querySelector('.controls .arrow-button:nth-of-type(1)');
    const forwardButton = customTreeSection.querySelector('.controls .arrow-button:nth-of-type(2)');
    
    if (backButton) {
      backButton.disabled = customTreeState.step === 0;
    }
    
    if (forwardButton) {
      forwardButton.disabled = customTreeState.conclusion === 'Target found!' || 
                               customTreeState.step >= customTreeState.steps.length;
    }
  } catch (error) {
    console.warn('Could not update button states:', error);
  }
  
  // Calculate array dimensions
  const arrayTotalWidth = customTreeList.length * (customTreeCardWidth + customTreeCardSpacing) - customTreeCardSpacing;
  const arrayStartX = (width - arrayTotalWidth) / 2;
  
  // Target card (positioned to the left of the array)
  const targetGroup = svg.append('g');
  targetGroup.append('rect')
    .attr('class', 'target-card')
    .attr('x', arrayStartX - customTreeCardWidth - 20)
    .attr('y', customTreeCardY)
    .attr('width', customTreeCardWidth)
    .attr('height', customTreeCardHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', '#e8eaf6')  // Light indigo color for target card
    .attr('stroke', '#3f51b5')  // Indigo border
    .attr('stroke-width', 1.5);
  targetGroup.append('text')
    .attr('x', arrayStartX - customTreeCardWidth / 2 - 20)
    .attr('y', customTreeCardY + customTreeCardHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '16px')
    .attr('font-family', 'Arial, sans-serif')
    .attr('fill', '#303f9f')  // Dark indigo for text
    .text(customTreeTarget);
  targetGroup.append('text')
    .attr('x', arrayStartX - customTreeCardWidth / 2 - 20)
    .attr('y', customTreeCardY + customTreeCardHeight + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'Arial, sans-serif')
    .text(customTreeState.conclusion === 'Target found!' ? 
      customTreeState.nodes.find(n => n.name === String(customTreeTarget))?.index : '?');
  
  // Draw array elements
  const arrayGroup = svg.append('g');
  arrayGroup.selectAll('.array-element')
    .data(customTreeList)
    .enter()
    .append('rect')
    .attr('class', 'array-element')
    .attr('x', (d, i) => arrayStartX + i * (customTreeCardWidth + customTreeCardSpacing))
    .attr('y', customTreeCardY)
    .attr('width', customTreeCardWidth)
    .attr('height', customTreeCardHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = customTreeState.nodes.find(n => n.name === customTreeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Highlight the array element matching the current node being compared
      if (i === currentIndex) {
        return '#e8eaf6';  // Light indigo color for current node
      } else if (customTreeState.conclusion === 'Target found!' && 
                 i === customTreeState.nodes.find(n => n.name === String(customTreeTarget))?.index) {
        return '#e8eaf6';  // Light indigo for target when found
      }
      return '#e3f2fd';  // Default light blue
    })
    .attr('stroke', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = customTreeState.nodes.find(n => n.name === customTreeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Highlight the array element matching the current node being compared
      if (i === currentIndex) {
        return '#3f51b5';  // Indigo border for current node
      } else if (customTreeState.conclusion === 'Target found!' && 
                 i === customTreeState.nodes.find(n => n.name === String(customTreeTarget))?.index) {
        return '#3f51b5';  // Indigo border for target when found
      }
      return '#2196F3';  // Default blue border
    })
    .attr('stroke-width', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = customTreeState.nodes.find(n => n.name === customTreeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Make the current node stroke thicker
      if (i === currentIndex) {
        return 3;  // Thicker stroke for current node
      }
      return 1.5;  // Default stroke width
    });

  // Add array values
  arrayGroup.selectAll('.array-value')
    .data(customTreeList)
    .enter()
    .append('text')
    .attr('x', (d, i) => arrayStartX + i * (customTreeCardWidth + customTreeCardSpacing) + customTreeCardWidth / 2)
    .attr('y', customTreeCardY + customTreeCardHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '16px')
    .attr('font-family', 'Arial, sans-serif')
    .text(d => d);

  // Add array indices
  arrayGroup.selectAll('.array-index')
    .data(customTreeList)
    .enter()
    .append('text')
    .attr('x', (d, i) => arrayStartX + i * (customTreeCardWidth + customTreeCardSpacing) + customTreeCardWidth / 2)
    .attr('y', customTreeCardY + customTreeCardHeight + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'Arial, sans-serif')
    .text((d, i) => i);

  // Simple tree visualization - shifted to the right to avoid text overlap
  const simpleTreeGroup = svg.append('g');
  const nodeRadius = 20;
  const nodeSpacing = 60;
  const levelHeight = 80;
  const treeShiftRight = 100; // Shift the tree to the right to avoid text overlap
  
  // Draw tree nodes and connections manually based on the predefined structure
  if (customTreeState.nodes.length > 0) {
    // Create a map of node positions
    const nodePositions = {};
    
    // Calculate positions based on tree structure
    function calculatePositions(nodes, links) {
      // Find the root node (node without a parent)
      const rootNode = nodes.find(n => !n.parent);
      if (!rootNode) return;
      
      // Create a map to track children of each node
      const childrenMap = {};
      nodes.forEach(node => {
        childrenMap[node.name] = [];
      });
      
      // Populate children map
      links.forEach(link => {
        if (childrenMap[link.source.name]) {
          childrenMap[link.source.name].push(link.target.name);
        }
      });
      
      // Calculate width needed for each subtree
      function calculateSubtreeWidth(nodeName) {
        const children = childrenMap[nodeName] || [];
        if (children.length === 0) return 1;
        
        return children.reduce((sum, child) => sum + calculateSubtreeWidth(child), 0);
      }
      
      // Calculate positions recursively
      function calculateNodePositions(nodeName, level, leftOffset, parentWidth) {
        const children = childrenMap[nodeName] || [];
        const subtreeWidth = calculateSubtreeWidth(nodeName);
        const x = leftOffset + (parentWidth * nodeSpacing / 2);
        const y = 150 + level * levelHeight;
        
        nodePositions[nodeName] = { x: x + treeShiftRight, y: y };
        
        let currentOffset = leftOffset;
        for (const child of children) {
          const childSubtreeWidth = calculateSubtreeWidth(child);
          calculateNodePositions(child, level + 1, currentOffset, childSubtreeWidth);
          currentOffset += childSubtreeWidth * nodeSpacing;
        }
      }
      
      // Start calculation from root
      const rootSubtreeWidth = calculateSubtreeWidth(rootNode.name);
      calculateNodePositions(rootNode.name, 0, width / 2 - (rootSubtreeWidth * nodeSpacing / 2), rootSubtreeWidth);
    }
    
    // Calculate positions for all nodes
    calculatePositions(customTreeState.nodes, customTreeState.links);
    
    // Draw links between nodes
    customTreeState.links.forEach(link => {
      if (nodePositions[link.source.name] && nodePositions[link.target.name]) {
        simpleTreeGroup.append('line')
          .attr('x1', nodePositions[link.source.name].x)
          .attr('y1', nodePositions[link.source.name].y)
          .attr('x2', nodePositions[link.target.name].x)
          .attr('y2', nodePositions[link.target.name].y)
          .attr('stroke', '#90A4AE')
          .attr('stroke-width', 1.5);
      }
    });
    
    // Draw nodes
    customTreeState.nodes.forEach(node => {
      if (nodePositions[node.name]) {
        // Node circle
        simpleTreeGroup.append('circle')
          .attr('cx', nodePositions[node.name].x)
          .attr('cy', nodePositions[node.name].y)
          .attr('r', nodeRadius)
          .attr('fill', customTreeState.currentNode === node.name ? '#e8eaf6' : 'white')  // Light indigo for current node
          .attr('stroke', customTreeState.currentNode === node.name ? '#3f51b5' : '#90A4AE')  // Indigo border
          .attr('stroke-width', customTreeState.currentNode === node.name ? 3 : 1.5);
        
        // Node label
        simpleTreeGroup.append('text')
          .attr('x', nodePositions[node.name].x)
          .attr('y', nodePositions[node.name].y)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '14px')
          .attr('font-weight', customTreeState.currentNode === node.name ? 'bold' : 'normal')
          .text(node.name);
      }
    });
  }
  
  // Show commentary and comparison info
  const commentaryGroup = svg.append('g');
  let yOffset = 80;
  
  // Always show the current number of comparisons
  commentaryGroup.append('text')
    .attr('x', margin)
    .attr('y', height - yOffset)
    .attr('text-anchor', 'start')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('fill', '#303f9f')  // Dark indigo
    .text(`Comparisons: ${customTreeState.finalComparisons !== null ? 
      customTreeState.finalComparisons : customTreeState.comparisons}`);
  
  yOffset += 25;
  
  // Position commentary on the left side to avoid overlap with the tree
  if (customTreeState.comparison && customTreeState.currentNode) {
    // Show comparison information
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', height - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .text(`• Comparing ${customTreeTarget} with node ${customTreeState.currentNode}`);
    
    if (customTreeState.conclusion) {
      yOffset += 20;
      commentaryGroup.append('text')
        .attr('x', margin)
        .attr('y', height - yOffset)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text(`• ${customTreeTarget} ${customTreeState.comparison.split(' ')[1]} ${customTreeState.currentNode}, ${customTreeState.conclusion}`);
    }
  }
  
  // Add explanation based on the current phase
  yOffset += 30;
  
  if (customTreeState.step < customTreeState.steps.findIndex(s => s.action === 'search')) {
    // Building tree phase
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', height - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#303f9f')
      .text(`Building the Binary Search Tree:`);
    
    // Add specific commentary about the current building step
    const currentStep = customTreeState.steps[Math.max(0, customTreeState.step - 1)];
    if (currentStep) {
      yOffset += 20;
      if (currentStep.action === 'addNode') {
        commentaryGroup.append('text')
          .attr('x', margin)
          .attr('y', height - yOffset)
          .attr('text-anchor', 'start')
          .attr('font-size', '14px')
          .text(`• Adding node ${currentStep.node.name} at index ${currentStep.node.index}`);
        
        yOffset += 20;
        commentaryGroup.append('text')
          .attr('x', margin)
          .attr('y', height - yOffset)
          .attr('text-anchor', 'start')
          .attr('font-size', '14px')
          .text(`• Selected as midpoint of subarray [${currentStep.left}...${currentStep.right}]`);
        
        if (currentStep.node.parent) {
          yOffset += 20;
          // Find the parent's subarray to explain the relationship
          const parentStep = customTreeState.steps.find(s => 
            s.action === 'addNode' && s.node.name === currentStep.node.parent);
          
          if (parentStep) {
            // Determine left/right based on indices, not node name values
            const parentNode = treeState.nodes.find(n => n.name === currentStep.node.parent);
            const relation = parentNode && currentStep.node.index < parentNode.index ? 'left' : 'right';
            commentaryGroup.append('text')
              .attr('x', margin)
              .attr('y', height - yOffset)
              .attr('text-anchor', 'start')
              .attr('font-size', '14px')
              .text(`• Added as ${relation} child of ${currentStep.node.parent} (mid=${parentStep.mid})`);
          }
        }
      } else if (currentStep.action === 'addLink') {
        // Explain the link in terms of the binary search tree structure
        const sourceNode = customTreeState.nodes.find(n => n.name === currentStep.source);
        const targetNode = customTreeState.nodes.find(n => n.name === currentStep.target);
        
        if (sourceNode && targetNode) {
          // Determine left/right based on indices, not values
          const relation = targetNode.index < sourceNode.index ? 'left' : 'right';
          commentaryGroup.append('text')
            .attr('x', margin)
            .attr('y', height - yOffset)
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .text(`• Connecting ${currentStep.source} to its ${relation} child ${currentStep.target}`);
        }
      }
    }
  } else {
    // Search phase
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', height - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#303f9f')
      .text(`Searching for ${customTreeTarget} in the tree:`);
    
    if (customTreeState.searchPath.length > 0) {
      yOffset += 20;
      commentaryGroup.append('text')
        .attr('x', margin)
        .attr('y', height - yOffset)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text(`• Search path: ${customTreeState.searchPath.join(' → ')}`);
    }
  }
  
  // Left, right, mid labels for the array
  if (customTreeState.step < customTreeState.steps.length) {
    const { left, right, mid } = customTreeState;
    const labelsByIndex = {};
    if (left >= 0 && left < customTreeList.length) {
      labelsByIndex[left] = labelsByIndex[left] || [];
      labelsByIndex[left].push({ text: 'left', color: '#2196F3' });
    }
    if (right >= 0 && right < customTreeList.length) {
      labelsByIndex[right] = labelsByIndex[right] || [];
      labelsByIndex[right].push({ text: 'right', color: '#F44336' });
    }
    if (mid >= 0 && mid < customTreeList.length) {
      labelsByIndex[mid] = labelsByIndex[mid] || [];
      labelsByIndex[mid].push({ text: 'mid', color: '#3f51b5' });  // Indigo for mid
    }

    Object.keys(labelsByIndex).forEach(index => {
      const labels = labelsByIndex[index];
      labels.forEach((label, i) => {
        svg.append('text')
          .attr('x', arrayStartX + Number(index) * (customTreeCardWidth + customTreeCardSpacing) + customTreeCardWidth / 2)
          .attr('y', customTreeCardY + customTreeCardHeight + 40 + (i * 15))
          .attr('text-anchor', 'middle')
          .attr('fill', label.color)
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif')
          .attr('font-weight', 'bold')
          .text(label.text);
      });
    });
  }
}
const margin = 20;

// Dynamically calculate width to fit within container
const containerWidth = 900;
const treeWidth = Math.min(containerWidth - 2 * margin, 800);
const treeHeight = 450;

// Center the array list
const arrayTotalWidth = treeList.length * (treeCardWidth + treeCardSpacing) - treeCardSpacing;
const arrayStartX = (treeWidth - arrayTotalWidth) / 2;

let treeState = null;
function startTreeVisualization() {
  console.log('startTreeVisualization called');
  treeState = {
    step: 0,
    nodes: [],
    links: [],
    searchPath: [],
    currentNode: null,
    currentNodeIndex: -1,  // Add explicit tracking of current node index
    left: 0,
    right: treeList.length - 1,
    mid: Math.floor((0 + treeList.length - 1) / 2),
    comparisons: 0,
    finalComparisons: null,
    comparison: '',
    conclusion: ''
  };
  
  // Define the steps for the tree visualization
  const steps = [
    { action: 'addNode', node: { name: 'E', index: 4 }, left: 0, right: 8, mid: 4 },
    { action: 'addNode', node: { name: 'B', index: 1, parent: 'E' }, left: 0, right: 3, mid: 1 },
    { action: 'addLink', source: 'E', target: 'B', left: 0, right: 3, mid: 1 },
    { action: 'addNode', node: { name: 'A', index: 0, parent: 'B' }, left: 0, right: 0, mid: 0 },
    { action: 'addLink', source: 'B', target: 'A', left: 0, right: 0, mid: 0 },
    { action: 'addNode', node: { name: 'C', index: 2, parent: 'B' }, left: 2, right: 3, mid: 2 },
    { action: 'addLink', source: 'B', target: 'C', left: 2, right: 3, mid: 2 },
    { action: 'addNode', node: { name: 'D', index: 3, parent: 'C' }, left: 3, right: 3, mid: 3 },
    { action: 'addLink', source: 'C', target: 'D', left: 3, right: 3, mid: 3 },
    { action: 'addNode', node: { name: 'G', index: 6, parent: 'E' }, left: 5, right: 8, mid: 6 },
    { action: 'addLink', source: 'E', target: 'G', left: 5, right: 8, mid: 6 },
    { action: 'addNode', node: { name: 'F', index: 5, parent: 'G' }, left: 5, right: 5, mid: 5 },
    { action: 'addLink', source: 'G', target: 'F', left: 5, right: 5, mid: 5 },
    { action: 'addNode', node: { name: 'H', index: 7, parent: 'G' }, left: 7, right: 8, mid: 7 },
    { action: 'addLink', source: 'G', target: 'H', left: 7, right: 8, mid: 7 },
    { action: 'addNode', node: { name: 'I', index: 8, parent: 'H' }, left: 8, right: 8, mid: 8 },
    { action: 'addLink', source: 'H', target: 'I', left: 8, right: 8, mid: 8 },
    { action: 'search', node: 'E', left: 0, right: 8, mid: 4, comparison: 'F > E', conclusion: 'Go right' },
    { action: 'search', node: 'G', left: 5, right: 8, mid: 6, comparison: 'F < G', conclusion: 'Go left' },
    { action: 'search', node: 'F', left: 5, right: 5, mid: 5, comparison: 'F = F', conclusion: 'Target found!' }
  ];
  
  treeState.steps = steps;
  renderTreeVisualization();
}

function stepTreeForward() {
  if (!treeState || treeState.step >= treeState.steps.length) return;
  const currentStep = treeState.steps[treeState.step];
  console.log('Step Tree Forward - Current Step:', currentStep);

  if (currentStep.action === 'addNode') {
    treeState.nodes.push(currentStep.node);
  } else if (currentStep.action === 'addLink') {
    treeState.links.push({ source: treeState.nodes.find(n => n.name === currentStep.source), target: treeState.nodes.find(n => n.name === currentStep.target) });
  } else if (currentStep.action === 'search') {
    // Reset comparisons at the start of search phase
    if (treeState.step === treeState.steps.findIndex(s => s.action === 'search')) {
      treeState.comparisons = 0;
    }
    treeState.currentNode = currentStep.node;
    console.log('Setting current node to:', currentStep.node);
    
    // Find and set the index of the current node
    const nodeObj = treeState.nodes.find(n => n.name === currentStep.node);
    if (nodeObj) {
      treeState.currentNodeIndex = nodeObj.index;
      console.log('Setting current node index to:', nodeObj.index);
    }
    
    treeState.searchPath.push(currentStep.node);
    if (treeState.finalComparisons === null) {
      treeState.comparisons++;
    }
    treeState.comparison = currentStep.comparison;
    treeState.conclusion = currentStep.conclusion;
    if (currentStep.conclusion === 'Target found!') {
      treeState.finalComparisons = treeState.comparisons;
    }
  }

  treeState.left = currentStep.left;
  treeState.right = currentStep.right;
  treeState.mid = currentStep.mid;
  treeState.step++;
  renderTreeVisualization();
}

function stepTreeBackward() {
  if (!treeState || treeState.step <= 0) return;
  treeState.step--;
  const currentStep = treeState.steps[treeState.step];

  if (currentStep.action === 'addNode') {
    treeState.nodes.pop();
  } else if (currentStep.action === 'addLink') {
    treeState.links.pop();
  } else if (currentStep.action === 'search') {
    treeState.searchPath.pop();
    treeState.currentNode = treeState.searchPath[treeState.searchPath.length - 1] || null;
    treeState.comparison = treeState.step > 0 && treeState.steps[treeState.step - 1].comparison ? treeState.steps[treeState.step - 1].comparison : '';
    treeState.conclusion = treeState.step > 0 && treeState.steps[treeState.step - 1].conclusion ? treeState.steps[treeState.step - 1].conclusion : '';
    if (treeState.finalComparisons !== null) {
      treeState.comparisons--;
      treeState.finalComparisons = null;
    }
  }

  treeState.left = currentStep.left;
  treeState.right = currentStep.right;
  treeState.mid = currentStep.mid;
  renderTreeVisualization();
}
function renderTreeVisualization() {
  console.log('renderTreeVisualization called', treeState);
  const svg = d3.select('#tree-representation svg');
  svg.selectAll('*').remove();
  svg.attr('width', treeWidth).attr('height', treeHeight);

  // Enable/disable buttons
  d3.select('#tree-representation .arrow-button:nth-child(2)') // Previous
    .property('disabled', treeState.step === 0);
  d3.select('#tree-representation .arrow-button:nth-child(3)') // Next
    .property('disabled', treeState.conclusion === 'Target found!');

  // Array visualization
  const arrayGroup = svg.append('g');
  
  // Update the current node index if needed
  if (treeState.currentNode && treeState.currentNodeIndex === -1) {
    const nodeObj = treeState.nodes.find(n => n.name === treeState.currentNode);
    if (nodeObj) {
      treeState.currentNodeIndex = nodeObj.index;
    }
  }
  console.log('Current Node:', treeState.currentNode);
  console.log('Current Node Index:', treeState.currentNodeIndex);
  
  // Target card (positioned to the left of the array)
  const targetGroup = svg.append('g');
  targetGroup.append('rect')
    .attr('class', 'target-card')
    .attr('x', arrayStartX - treeCardWidth - 20)
    .attr('y', treeCardY)
    .attr('width', treeCardWidth)
    .attr('height', treeCardHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', '#e8eaf6')  // Light indigo color for target card
    .attr('stroke', '#3f51b5')  // Indigo border
    .attr('stroke-width', 1.5);
  targetGroup.append('text')
    .attr('x', arrayStartX - treeCardWidth / 2 - 20)
    .attr('y', treeCardY + treeCardHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '16px')
    .attr('font-family', 'Arial, sans-serif')
    .attr('fill', '#303f9f')  // Dark indigo for text
    .text(treeTarget);
  targetGroup.append('text')
    .attr('x', arrayStartX - treeCardWidth / 2 - 20)
    .attr('y', treeCardY + treeCardHeight + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'Arial, sans-serif')
    .text(treeState.conclusion === 'Target found!' ? treeState.nodes.find(n => n.name === treeTarget)?.index : '?');
  
  // Draw array elements
  arrayGroup.selectAll('.array-element')
    .data(treeList)
    .enter()
    .append('rect')
    .attr('class', 'array-element')
    .attr('x', (d, i) => arrayStartX + i * (treeCardWidth + treeCardSpacing))
    .attr('y', treeCardY)
    .attr('width', treeCardWidth)
    .attr('height', treeCardHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = treeState.nodes.find(n => n.name === treeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Highlight the array element matching the current node being compared
      if (i === currentIndex) {
        return '#e8eaf6';  // Light indigo color for current node
      } else if (treeState.conclusion === 'Target found!' && i === treeState.nodes.find(n => n.name === treeTarget)?.index) {
        return '#e8eaf6';  // Light indigo for target when found
      }
      return '#e3f2fd';  // Default light blue
    })
    .attr('stroke', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = treeState.nodes.find(n => n.name === treeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Highlight the array element matching the current node being compared
      if (i === currentIndex) {
        return '#3f51b5';  // Indigo border for current node
      } else if (treeState.conclusion === 'Target found!' && i === treeState.nodes.find(n => n.name === treeTarget)?.index) {
        return '#3f51b5';  // Indigo border for target when found
      }
      return '#2196F3';  // Default blue border
    })
    .attr('stroke-width', (d, i) => {
      // Find the current node index for proper highlighting
      const currentNodeObj = treeState.nodes.find(n => n.name === treeState.currentNode);
      const currentIndex = currentNodeObj ? currentNodeObj.index : -1;
      
      // Make the current node stroke thicker
      if (i === currentIndex) {
        return 3;  // Thicker stroke for current node
      }
      return 1.5;  // Default stroke width
    });

  // Add array values
  arrayGroup.selectAll('.array-value')
    .data(treeList)
    .enter()
    .append('text')
    .attr('x', (d, i) => arrayStartX + i * (treeCardWidth + treeCardSpacing) + treeCardWidth / 2)
    .attr('y', treeCardY + treeCardHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', '16px')
    .attr('font-family', 'Arial, sans-serif')
    .text(d => d);

  // Add array indices
  arrayGroup.selectAll('.array-index')
    .data(treeList)
    .enter()
    .append('text')
    .attr('x', (d, i) => arrayStartX + i * (treeCardWidth + treeCardSpacing) + treeCardWidth / 2)
    .attr('y', treeCardY + treeCardHeight + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'Arial, sans-serif')
    .text((d, i) => i);

  // Simple tree visualization - shifted to the right to avoid text overlap
  const simpleTreeGroup = svg.append('g');
  const nodeRadius = 20;
  const nodeSpacing = 60;
  const levelHeight = 80;
  const treeShiftRight = 100; // Shift the tree to the right to avoid text overlap
  
  // Draw tree nodes and connections manually based on the predefined structure
  if (treeState.nodes.length > 0) {
    // Create a map of node positions
    const nodePositions = {};
    
    // Root node (E) at level 0
    nodePositions['E'] = { x: treeWidth / 2 + treeShiftRight, y: 150 };
    
    // Level 1: B and G
    nodePositions['B'] = { x: treeWidth / 3 + treeShiftRight, y: 150 + levelHeight };
    nodePositions['G'] = { x: 2 * treeWidth / 3 + treeShiftRight, y: 150 + levelHeight };
    
    // Level 2: A, C, F, H
    nodePositions['A'] = { x: treeWidth / 4 + treeShiftRight, y: 150 + 2 * levelHeight };
    nodePositions['C'] = { x: 5 * treeWidth / 12 + treeShiftRight, y: 150 + 2 * levelHeight };
    nodePositions['F'] = { x: 7 * treeWidth / 12 + treeShiftRight, y: 150 + 2 * levelHeight };
    nodePositions['H'] = { x: 3 * treeWidth / 4 + treeShiftRight, y: 150 + 2 * levelHeight };
    
    // Level 3: D, I
    nodePositions['D'] = { x: 5 * treeWidth / 12 + treeShiftRight, y: 150 + 3 * levelHeight };
    nodePositions['I'] = { x: 3 * treeWidth / 4 + treeShiftRight, y: 150 + 3 * levelHeight };
    
    // Draw links between nodes
    treeState.links.forEach(link => {
      if (nodePositions[link.source.name] && nodePositions[link.target.name]) {
        simpleTreeGroup.append('line')
          .attr('x1', nodePositions[link.source.name].x)
          .attr('y1', nodePositions[link.source.name].y)
          .attr('x2', nodePositions[link.target.name].x)
          .attr('y2', nodePositions[link.target.name].y)
          .attr('stroke', '#90A4AE')
          .attr('stroke-width', 1.5);
      }
    });
    
    // Draw nodes
    treeState.nodes.forEach(node => {
      if (nodePositions[node.name]) {
        // Node circle
        simpleTreeGroup.append('circle')
          .attr('cx', nodePositions[node.name].x)
          .attr('cy', nodePositions[node.name].y)
          .attr('r', nodeRadius)
          .attr('fill', treeState.currentNode === node.name ? '#e8eaf6' : 'white')  // Light indigo for current node
          .attr('stroke', treeState.currentNode === node.name ? '#3f51b5' : '#90A4AE')  // Indigo border
          .attr('stroke-width', treeState.currentNode === node.name ? 3 : 1.5);
        
        // Node label
        simpleTreeGroup.append('text')
          .attr('x', nodePositions[node.name].x)
          .attr('y', nodePositions[node.name].y)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '14px')
          .attr('font-weight', treeState.currentNode === node.name ? 'bold' : 'normal')
          .text(node.name);
      }
    });
  }
  
  // Show commentary and comparison info
  const commentaryGroup = svg.append('g');
  let yOffset = 80;
  
  // Always show the current number of comparisons
  commentaryGroup.append('text')
    .attr('x', margin)
    .attr('y', treeHeight - yOffset)
    .attr('text-anchor', 'start')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('fill', '#303f9f')  // Dark indigo
    .text(`Comparisons: ${treeState.finalComparisons !== null ? treeState.finalComparisons : treeState.comparisons}`);
  
  yOffset += 25;
  
  // Position commentary on the left side to avoid overlap with the tree
  if (treeState.comparison && treeState.currentNode) {
    // Show comparison information
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', treeHeight - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .text(`• Comparing ${treeTarget} with node ${treeState.currentNode}`);
    
    if (treeState.conclusion) {
      yOffset += 20;
      commentaryGroup.append('text')
        .attr('x', margin)
        .attr('y', treeHeight - yOffset)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text(`• ${treeTarget} ${treeState.comparison.split(' ')[1]} ${treeState.currentNode}, ${treeState.conclusion}`);
    }
  }
  
  // Add explanation based on the current phase
  yOffset += 30;
  
  if (treeState.step < treeState.steps.findIndex(s => s.action === 'search')) {
    // Building tree phase
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', treeHeight - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#303f9f')
      .text(`Building the Binary Search Tree:`);
    
    // Add specific commentary about the current building step
    const currentStep = treeState.steps[Math.max(0, treeState.step - 1)];
    if (currentStep) {
      yOffset += 20;
      if (currentStep.action === 'addNode') {
        // Explain how the node is selected based on the midpoint of the subarray
        commentaryGroup.append('text')
          .attr('x', margin)
          .attr('y', treeHeight - yOffset)
          .attr('text-anchor', 'start')
          .attr('font-size', '14px')
          .text(`• Adding node ${currentStep.node.name} at index ${currentStep.node.index}`);
        
        yOffset += 20;
        commentaryGroup.append('text')
          .attr('x', margin)
          .attr('y', treeHeight - yOffset)
          .attr('text-anchor', 'start')
          .attr('font-size', '14px')
          .text(`• Selected as midpoint of subarray [${currentStep.left}...${currentStep.right}]`);
        
        if (currentStep.node.parent) {
          yOffset += 20;
          // Find the parent's subarray to explain the relationship
          const parentStep = treeState.steps.find(s => 
            s.action === 'addNode' && s.node.name === currentStep.node.parent);
          
          if (parentStep) {
            // Determine left/right based on indices, not node name values
            const parentNode = treeState.nodes.find(n => n.name === currentStep.node.parent);
            const relation = parentNode && currentStep.node.index < parentNode.index ? 'left' : 'right';
            commentaryGroup.append('text')
              .attr('x', margin)
              .attr('y', treeHeight - yOffset)
              .attr('text-anchor', 'start')
              .attr('font-size', '14px')
              .text(`• Added as ${relation} child of ${currentStep.node.parent} (mid=${parentStep.mid})`);
          } else {
            commentaryGroup.append('text')
              .attr('x', margin)
              .attr('y', treeHeight - yOffset)
              .attr('text-anchor', 'start')
              .attr('font-size', '14px')
              .text(`• Child of ${currentStep.node.parent}`);
          }
        }
      } else if (currentStep.action === 'addLink') {
        // Explain the link in terms of the binary search tree structure
        const sourceNode = treeState.nodes.find(n => n.name === currentStep.source);
        const targetNode = treeState.nodes.find(n => n.name === currentStep.target);
        
        if (sourceNode && targetNode) {
          // Determine left/right based on indices, not values
          const relation = targetNode.index < sourceNode.index ? 'left' : 'right';
          commentaryGroup.append('text')
            .attr('x', margin)
            .attr('y', treeHeight - yOffset)
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .text(`• Connecting ${currentStep.source} to its ${relation} child ${currentStep.target}`);
          
          yOffset += 20;
          commentaryGroup.append('text')
            .attr('x', margin)
            .attr('y', treeHeight - yOffset)
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .text(`• ${currentStep.target} (${targetNode.index}) is ${relation} of ${currentStep.source} (${sourceNode.index})`);
        } else {
          commentaryGroup.append('text')
            .attr('x', margin)
            .attr('y', treeHeight - yOffset)
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .text(`• Connecting node ${currentStep.source} to ${currentStep.target}`);
        }
      }
    }
  } else {
    // Search phase
    commentaryGroup.append('text')
      .attr('x', margin)
      .attr('y', treeHeight - yOffset)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#303f9f')
      .text(`Searching for ${treeTarget} in the tree:`);
    
    if (treeState.searchPath.length > 0) {
      yOffset += 20;
      commentaryGroup.append('text')
        .attr('x', margin)
        .attr('y', treeHeight - yOffset)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text(`• Search path: ${treeState.searchPath.join(' → ')}`);
    }
  }

  // Left, right, mid labels for the array
  if (treeState.step < treeState.steps.length) {
    const { left, right, mid } = treeState;
    const labelsByIndex = {};
    if (left >= 0) {
      labelsByIndex[left] = labelsByIndex[left] || [];
      labelsByIndex[left].push({ text: 'left', color: '#2196F3' });
    }
    if (right >= 0) {
      labelsByIndex[right] = labelsByIndex[right] || [];
      labelsByIndex[right].push({ text: 'right', color: '#F44336' });
    }
    if (mid >= 0) {
      labelsByIndex[mid] = labelsByIndex[mid] || [];
      labelsByIndex[mid].push({ text: 'mid', color: '#3f51b5' });  // Indigo for mid
    }

    Object.keys(labelsByIndex).forEach(index => {
      const labels = labelsByIndex[index];
      labels.forEach((label, i) => {
        svg.append('text')
          .attr('x', arrayStartX + Number(index) * (treeCardWidth + treeCardSpacing) + treeCardWidth / 2)
          .attr('y', treeCardY + treeCardHeight + 40 + (i * 15))
          .attr('text-anchor', 'middle')
          .attr('fill', label.color)
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif')
          .attr('font-weight', 'bold')
          .text(label.text);
      });
    });
  }

  // Comparison counter (below comparison and conclusion)
  infoGroup.append('text')
    .attr('class', 'comparison-counter')
    .attr('x', margin)
    .attr('y', treeCardY + treeCardHeight + 110)
    .attr('text-anchor', 'start')
    .attr('font-size', '14px')
    .attr('font-family', 'Arial, sans-serif')
    .attr('fill', '#333')
    .attr('font-weight', 'bold')
    .text(`Comparisons: ${treeState.finalComparisons !== null ? treeState.finalComparisons : treeState.comparisons}`);
  infoGroup.transition().duration(1).attr('opacity', 1);

  // Explanation (positioned on left, below counter)
  if (treeState.step < treeState.steps.length) {
    const { left, right, action } = treeState.steps[treeState.step];
    const explanationGroup = svg.append('g').attr('opacity', 0);
    const explanationText = explanationGroup.append('text')
      .attr('class', 'explanation-text')
      .attr('x', margin)
      .attr('y', treeCardY + treeCardHeight + 130)
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#444');

    if (['addNode', 'addLink'].includes(action)) {
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '0')
        .attr('font-weight', 'bold')
        .text('Building a Binary Search Tree:');
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '1.4em')
        .text(`• Node ${treeState.nodes[treeState.nodes.length - 1]?.name || 'E'} is the midpoint`);
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '1.4em')
        .text(`• Subarray range: [${left}, ${right}]`);
      
      // Determine the relationship (left child or right child) in the current step
      const currentStep = treeState.steps[treeState.step];
      if (currentStep && currentStep.action === 'addLink') {
        const sourceNode = treeState.nodes.find(n => n.name === currentStep.source);
        const targetNode = treeState.nodes.find(n => n.name === currentStep.target);
        
        if (sourceNode && targetNode) {
          // Determine left/right based on indices, not values
          const relation = targetNode.index < sourceNode.index ? 'Left' : 'Right';
          explanationText.append('tspan')
            .attr('x', margin)
            .attr('dy', '1.4em')
            .text(`• ${relation} child: Midpoint of ${relation.toLowerCase()} subarray`);
        } else {
          // Fallback to showing both options if we can't determine the relationship
          explanationText.append('tspan')
            .attr('x', margin)
            .attr('dy', '1.4em')
            .text('• Left child: Midpoint of left subarray');
          explanationText.append('tspan')
            .attr('x', margin)
            .attr('dy', '1.4em')
            .text('• Right child: Midpoint of right subarray');
        }
      } else {
        // Fallback to showing both options for non-addLink steps
        explanationText.append('tspan')
          .attr('x', margin)
          .attr('dy', '1.4em')
          .text('• Left child: Midpoint of left subarray');
        explanationText.append('tspan')
          .attr('x', margin)
          .attr('dy', '1.4em')
          .text('• Right child: Midpoint of right subarray');
      }
    } else if (action === 'search') {
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '0')
        .attr('font-weight', 'bold')
        .text('Searching for F:');
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '1.4em')
        .text(`• Comparing F with node ${treeState.currentNode}`);
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '1.4em')
        .text(treeState.conclusion === 'Target found!' ? '• F matches the node!' : 
              `• F is ${treeState.comparison.split(' ')[1]} ${treeState.currentNode}, go ${treeState.conclusion.split(' ')[1].toLowerCase()}`);
      explanationText.append('tspan')
        .attr('x', margin)
        .attr('dy', '1.4em')
        .text('• Each step halves the search space');
      if (treeState.conclusion === 'Target found!') {
        explanationText.append('tspan')
          .attr('x', margin)
          .attr('dy', '1.4em')
          .text('• O(log n) efficiency achieved!');
      }
    }
    explanationGroup.transition().duration(1).attr('opacity', 1);
  }

  // Mid calculation (positioned on right)
  if (treeState.step < treeState.steps.length) {
    const { left, right, mid, action } = treeState.steps[treeState.step];
    const mathGroup = svg.append('g').attr('opacity', 0);
    if (['addNode', 'addLink', 'search'].includes(action)) {
      const mathText = mathGroup.append('text')
        .attr('class', 'mid-formula')
        .attr('x', treeWidth - margin - 150)
        .attr('y', treeCardY + treeCardHeight + 90)
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', '#444');
      mathText.append('tspan')
        .attr('x', treeWidth - margin - 150)
        .attr('dy', '0')
        .attr('font-weight', 'bold')
        .text('Midpoint Calculation:');
      mathText.append('tspan')
        .attr('x', treeWidth - margin - 150)
        .attr('dy', '1.4em')
        .text(`mid = floor((${left} + ${right}) / 2)`);
      mathText.append('tspan')
        .attr('x', treeWidth - margin - 150)
        .attr('dy', '1.4em')
        .text(`= ${mid}`);
    }
    mathGroup.transition().duration(1).attr('opacity', 1);
  }

  // Tree visualization
  const treeGroup = svg.append('g').attr('transform', `translate(${treeWidth / 2}, 150)`);

  // Create a tree layout
  const treeLayout = d3.tree().size([treeWidth - 100, treeHeight - 200]);

  // Create a hierarchy from the root node
  let root = null;
  if (treeState.nodes.length > 0) {
    // Find the root node (node without a parent)
    const rootNode = treeState.nodes.find(n => !n.parent);
    if (rootNode) {
      // Create a hierarchy with the root node
      root = d3.hierarchy({ name: rootNode.name, children: [] });

      // Helper function to add children to a node
      function addChildren(node, parentName) {
        const children = treeState.links
          .filter(link => link.source.name === parentName)
          .map(link => {
            const childName = link.target.name;
            return { name: childName, children: [] };
          });

        node.children = children.map(child => {
          const childNode = d3.hierarchy(child);
          addChildren(childNode, child.name);
          return childNode;
        });
      }

      // Add all children to the root node
      addChildren(root, rootNode.name);

      // Apply the tree layout to the hierarchy
      treeLayout(root);

      // Draw links between nodes
      treeGroup.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
          return `M${d.source.x},${d.source.y}
                  C${d.source.x},${(d.source.y + d.target.y) / 2}
                   ${d.target.x},${(d.source.y + d.target.y) / 2}
                   ${d.target.x},${d.target.y}`;
        })
        .attr('fill', 'none')
        .attr('stroke', '#90A4AE')
        .attr('stroke-width', 1.5);

      // Draw nodes
      const nodes = treeGroup.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

      // Add circles for nodes
      nodes.append('circle')
        .attr('r', 20)
        .attr('fill', d => {
          if (treeState.currentNode === d.data.name) {
            return '#ffebee';  // Light red background for current node
          }
          return 'white';
        })
        .attr('stroke', d => {
          if (treeState.currentNode === d.data.name) {
            return '#e53935';  // Red border for current node
          }
          return '#90A4AE';
        })
        .attr('stroke-width', d => {
          if (treeState.currentNode === d.data.name) {
            return 3;  // Thicker border for current node
          }
          return 1.5;
        });

      // Add text labels for node values
      nodes.append('text')
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', d => {
          if (treeState.currentNode === d.data.name) {
            return 'bold';  // Bold text for current node
          }
          return 'normal';
        })
        .text(d => d.data.name);
    }
  }
}

function stepJumpSearchBackward() {
  if (!jumpState || (jumpState.phase === 'jump' && jumpState.currentIndex <= 0 && !jumpState.showComparison)) return;

  // If we're showing a comparison, just toggle it off
  if (jumpState.showComparison) {
    jumpState.showComparison = false;
    jumpState.comparisons = Math.max(0, jumpState.comparisons - 1);
    renderJumpSearch();
    return;
  }
  
  jumpState.found = false;
  jumpState.lastComparedValue = null;
  jumpState.lastComparedIndex = null;
  
  if (jumpState.phase === 'linear') {
      // If we're at the beginning of linear phase, go back to jump phase
      if (jumpState.currentIndex === jumpState.prevBlock) {
          jumpState.phase = 'jump';
          // Remove ruled out elements from the previous block
          for (let i = 0; i < jumpState.prevBlock; i++) {
              jumpState.ruledOut.delete(i);
          }
      } else {
          jumpState.currentIndex--;
          jumpState.ruledOut.delete(jumpState.currentIndex);
      }
  } else { // jump phase
      // If we're at the first jump, reset to beginning
      if (jumpState.currentIndex === Math.min(Math.floor(Math.sqrt(searchList.length)), searchList.length - 1)) {
          jumpState.currentIndex = 0;
          jumpState.prevBlock = 0;
          jumpState.ruledOut.clear();
      } else {
          // Go back to previous block
          const blockSize = Math.floor(Math.sqrt(searchList.length));
          jumpState.currentIndex = jumpState.prevBlock;
          jumpState.prevBlock = Math.max(0, jumpState.prevBlock - blockSize);
          // Clear ruled out elements for the current block
          for (let i = jumpState.prevBlock; i < jumpState.currentIndex; i++) {
              jumpState.ruledOut.delete(i);
          }
      }
  }
  
  renderJumpSearch();
}

function renderJumpSearch() {
  const svg = d3.select('#jump-search svg');
  svg.attr('width', searchWidth).attr('height', searchHeight);
  svg.selectAll('*').remove();

  const n = searchList.length;

  // Enable/disable buttons
  d3.select('#jump-search .controls button:nth-child(2)') // Previous
    .attr('disabled', jumpState && jumpState.currentIndex <= 0 && !jumpState.showComparison ? true : null);
  d3.select('#jump-search .controls button:nth-child(3)') // Next
    .attr('disabled', jumpState && jumpState.phase === 'done' ? true : null);

  // Target card
  const targetGroup = svg.append('g').attr('class', 'target-group');
  targetGroup.append('rect')
    .attr('class', 'target-card')
    .attr('x', targetCardX)
    .attr('y', cardY)
    .attr('width', cardWidth)
    .attr('height', cardHeight);
  targetGroup.append('text')
    .attr('x', targetCardX + cardWidth / 2)
    .attr('y', cardY + cardHeight / 2)
    .attr('text-anchor', 'middle')
    .text(searchTarget);
  targetGroup.append('text')
    .attr('x', targetCardX + cardWidth / 2)
    .attr('y', cardY + cardHeight + 20)
    .attr('text-anchor', 'middle')
    .text(jumpState.found ? searchList.indexOf(searchTarget) : '?');
    
  // Add 'Target Found!' message when target is found
  if (jumpState.found) {
    svg.append('text')
      .attr('x', targetCardX + cardWidth / 2)
      .attr('y', cardY - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#3f51b5')  // Indigo color
      .text('Target Found!');
  }

  // Cards
  const listGroup = svg.append('g').attr('class', 'list-group');
  listGroup.selectAll('.element')
    .data(searchList)
    .enter()
    .append('rect')
    .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing))
    .attr('y', cardY)
    .attr('width', cardWidth)
    .attr('height', cardHeight)
    .attr('class', (d, i) => {
      if (jumpState.found && d === searchTarget) return 'target-card';
      if (jumpState.ruledOut.has(i)) return 'ruled-out';
      if (i === jumpState.currentIndex && jumpState.phase !== 'done') return 'target-card';
      return 'unflipped';
    });

  // Card values
  listGroup.selectAll('.value')
    .data(searchList)
    .enter()
    .append('text')
    .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
    .attr('y', cardY + cardHeight / 2)
    .attr('text-anchor', 'middle')
    .text((d, i) => jumpState.ruledOut.has(i) || (i === jumpState.currentIndex && jumpState.phase !== 'done') || (jumpState.found && d === searchTarget) ? d : '');

  // Indices
  listGroup.selectAll('.index')
    .data(searchList)
    .enter()
    .append('text')
    .attr('x', (d, i) => listStartX + i * (cardWidth + cardSpacing) + cardWidth / 2)
    .attr('y', cardY + cardHeight + 20)
    .attr('text-anchor', 'middle')
    .text((d, i) => i);

  // Show comparison if we're in that state
  if (jumpState.showComparison && jumpState.lastComparedIndex !== null) {
    const currentX = listStartX + jumpState.lastComparedIndex * (cardWidth + cardSpacing) + cardWidth / 2;
    const comparisonGroup = svg.append('g').attr('class', 'comparison-group');
    comparisonGroup.append('rect')
      .attr('class', 'comparison-background')
      .attr('x', (targetCardX + cardWidth + currentX) / 2 - 50)
      .attr('y', cardY + cardHeight / 2 - 20)
      .attr('width', 100)
      .attr('height', 20);
    comparisonGroup.append('path')
      .attr('class', 'comparison-arrow')
      .attr('d', `M${targetCardX + cardWidth},${cardY + cardHeight / 2} L${currentX},${cardY + cardHeight / 2}`);
    
    // Determine the comparison operator based on the phase
    let comparisonOperator;
    if (jumpState.phase === 'jump') {
      comparisonOperator = jumpState.lastComparedValue >= searchTarget ? '≥' : '<';
    } else { // linear phase
      comparisonOperator = jumpState.lastComparedValue === searchTarget ? '=' : '≠';
    }
    
    comparisonGroup.append('text')
      .attr('x', (targetCardX + cardWidth + currentX) / 2)
      .attr('y', cardY + cardHeight / 2 - 5)
      .attr('text-anchor', 'middle')
      .text(`${searchTarget} ${comparisonOperator} ${jumpState.lastComparedValue}`);
  }

  // Percentage bar and comparison counter
  let remaining = 0;
  if (jumpState.found || jumpState.phase === 'done') {
    remaining = 0;
  } else if (jumpState.phase === 'jump') {
    // In jump phase, we've ruled out everything from 0 to currentIndex-1
    // as well as anything explicitly in ruledOut
    const ruledOutCount = jumpState.ruledOut.size;
    remaining = searchList.length - ruledOutCount;
  } else if (jumpState.phase === 'linear') {
    // In linear phase, we're only searching from prevBlock to prevBlock+blockSize
    const blockSize = Math.floor(Math.sqrt(searchList.length));
    remaining = Math.min(jumpState.prevBlock + blockSize, searchList.length) - jumpState.currentIndex;
  }
  const percentage = (remaining / searchList.length) * 100;
  const barGroup = svg.append('g').attr('class', 'bar-group');
  barGroup.append('rect')
    .attr('class', 'percentage-background')
    .attr('x', targetCardX)
    .attr('y', cardY + cardHeight + 40)
    .attr('width', searchWidth - targetCardX - 20)
    .attr('height', 20);
  barGroup.append('rect')
    .attr('class', 'percentage-bar')
    .attr('x', targetCardX)
    .attr('y', cardY + cardHeight + 40)
    .attr('width', ((searchWidth - targetCardX - 20) * percentage) / 100)
    .attr('height', 20);
  barGroup.append('text')
    .attr('x', searchWidth / 2)
    .attr('y', cardY + cardHeight + 55)
    .attr('text-anchor', 'middle')
    .text(`${Math.round(percentage)}% Search Space Remaining`);

  svg.selectAll('.comparison-counter').remove();
  svg.append('text')
    .attr('class', 'comparison-counter')
    .attr('x', searchWidth / 2)
    .attr('y', cardY + cardHeight + 85)
    .attr('text-anchor', 'middle')
    .text(`Comparisons: ${jumpState.comparisons}`);
  
  // Add phase indicator
  svg.append('text')
    .attr('class', 'phase-indicator')
    .attr('x', searchWidth / 2)
    .attr('y', cardY + cardHeight + 115)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(`Phase: ${jumpState.phase.charAt(0).toUpperCase() + jumpState.phase.slice(1)}`);
}