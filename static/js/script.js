// generate random data takes html objects as args
function generateArray(arrayRange=100, arraySize=10){
    if (arrayRange <= 0 || arraySize <= 0){
        console.log("data range and data size must be greater than zero.")
        return []
    }
    const result = [];
    for (let i = 0; i < arraySize; i++){

        let randomNumber = Math.floor(Math.random() * (arrayRange + 1));
        if(randomNumber==0){
            randomNumber = 1;
        };
        result.push(randomNumber);
    }
    return result
}

// constants for data display
const ANIMATION_SPEED = 1000;
const PRIMARY_COLOR = 'rgba(161, 198, 247, 1)';
const SECONDARY_COLOR = 'red';

// call generate data function
const data = generateArray()

const bodyElm = document.getElementById("body1")

// if the current path is not home page then we will remove the gif background 
// and load the chart to the screen.
if (window.location.pathname != "/"){
    // remove background gif
    bodyElm.classList.remove("bg-img")

    // create new chart on page reload
    const ctx = document.getElementById("chart").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: data.length }, (_, i) => i + 1),
        datasets: [{
        backgroundColor: 'rgba(161, 198, 247, 1)',
        borderColor: 'rgb(47, 128, 237)',
        data: data,
        }]
    },
    options: {
        plugins: {
        scales: {
        yAxes: [{
            ticks: {
            beginAtZero: true,
            }
        }],
        }
    },
    }
    });
}else{
    bodyElm.classList.add("bg-img")
}

// TODO - finish searching algorithm submission
function submitSearch(){
    const form = document.getElementById('search-form');
    const formData = new FormData(form);

    console.log(formData["algorithm"])
}

// function for submiting the sorting form
function submitSort(){
    
    const form = document.getElementById('sort-form');
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    }); 
    const range = parseInt(formData.get("valueRange"))
    const size = parseInt(formData.get("dataSize"))

    // generates an array using the form data
    const data = generateArray(range, size)
    myChart.data.datasets[0].data = data;
    myChart.data.labels = Array.from({ length: data.length }, (_, i) => i + 1),

    myChart.update()
    const algorithm = formData.get("algorithm")
    if(algorithm == 1){
        selectionSort(data);
    }else if(algorithm == 2){
        mergeSort(data);
    }else if(algorithm == 3){
        quickSort(data);
    }else if(algorithm == 4){
        bucketSort(data);
    }else if(algorithm == 5){
        radixSort(data);
    }else if(algorithm == 6){
        insertionSort(data);
    }else{
        alert("Something went wrong try again later.")
    }
}

function selectionSort(data) {
    fetch('/sorting/selection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: new URLSearchParams({ 'array[]': data }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(animationData => {
        // Update the UI with sorted array and highlight bars
        const sortedArray = animationData.sorted_array;
        const animations = animationData.swap_indexes;

        // Implement your animation logic using sortedArray and swapIndexes
        let animationIndex = 0;

        async function animateSwap() {
            if (animationIndex < animations.length) {
                const [index1, index2] = animations[animationIndex];
                console.log(index1, index2)
                // Highlight bars being swapped
                const newColors = Array.from({ length: data.length }, (_, i) => i === index1 || i === index2 ? 'red' : 'rgba(161, 198, 247, 1)');
                myChart.data.datasets[0].backgroundColor = newColors;
                // Update the chart
                myChart.update();
                await sleep(1000);

                // Swap bars in the chart
                [myChart.data.datasets[0].data[index1], myChart.data.datasets[0].data[index2]] =
                    [myChart.data.datasets[0].data[index2], myChart.data.datasets[0].data[index1]];
                myChart.update();
                await sleep(1000);
                // Remove highlight after a short delay
                setTimeout(() => {
                    myChart.data.datasets[0].backgroundColor[index1] = PRIMARY_COLOR;
                    myChart.data.datasets[0].backgroundColor[index2] = PRIMARY_COLOR;
                    myChart.update();

                    // Continue with the next animation
                    animationIndex++;
                    animateSwap();
                }, ANIMATION_SPEED);
            }
        }

        // Start the animation
        animateSwap();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

    console.log("Selection Sort");
    console.log(data);
}

function mergeSort(data) {
    fetch('/sorting/merge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: new URLSearchParams({ 'array[]': data }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(animationData => {
        // Update the UI with sorted array and highlight bars
        const animations = animationData.steps;
        console.log(animations)
        // Function to animate the merge sort steps
        async function animateMergeSort() {
            for (let i = 0; i < animations.length; i++) {
                const step = animations[i];
                const mergedArray = step.merged_array;
                // Highlight the bars being merged
                let sortedData = []
                console.log(sortedData)
                let colorData = [];
                for (let t = n = 0 ; n < data.length; n++){
                    if(n < step.start){
                        colorData.push('green');
                        sortedData.push(myChart.data.datasets[0].data[n])
                    }else if(n > step.end ){
                        colorData.push('gray');
                        sortedData.push(myChart.data.datasets[0].data[n])
                    }else{
                        colorData.push('red');
                        sortedData[n] = mergedArray[t];
                        t++;
                    }
                    console.log(sortedData, step.start)
                }
                myChart.data.datasets[0].backgroundColor = colorData;
                myChart.update();
                // Wait for a short duration
                await sleep(ANIMATION_SPEED);

                // Update the chart with the merged array for the current step

                myChart.data.datasets[0].data = sortedData;
                myChart.update();
                await sleep(ANIMATION_SPEED);
            }
            // Remove highlight after a short delay
            setTimeout(() => {
                myChart.data.datasets[0].backgroundColor = Array.from({ length: data.length }, () => PRIMARY_COLOR);
                myChart.update();
            }, ANIMATION_SPEED);
        }

        // Call the function to start the animation
        animateMergeSort();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

    console.log("Merge Sort");
    console.log(data);
}

function quickSort(data){
    console.log("Quick Sort")

    fetch('/sorting/quick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: new URLSearchParams({ 'array[]': data }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(animationData => {
        // Update the UI with sorted array and highlight bars
        const sortedArray = animationData.sorted_array;
        const animations = animationData.animations;
        // Implement your animation logic using sortedArray and swapIndexes
        let animationIndex = 0;
        console.log("data for quick sort: ", animations )
        async function animateSwap() {
            if (animationIndex < animations.length) {
                const [index1, index2] = animations[animationIndex];
                console.log(index1, index2)
                // Highlight bars being swapped
                const newColors = Array.from({ length: data.length }, (_, i) => i === index1 || i === index2 ? 'red' : 'rgba(161, 198, 247, 1)');
                myChart.data.datasets[0].backgroundColor = newColors;
                // Update the chart
                myChart.update();
                await sleep(1000);

                // Swap bars in the chart
                [myChart.data.datasets[0].data[index1], myChart.data.datasets[0].data[index2]] =
                    [myChart.data.datasets[0].data[index2], myChart.data.datasets[0].data[index1]];
                myChart.update();
                await sleep(1000);
                // Remove highlight after a short delay
                setTimeout(() => {
                    myChart.data.datasets[0].backgroundColor[index1] = PRIMARY_COLOR;
                    myChart.data.datasets[0].backgroundColor[index2] = PRIMARY_COLOR;
                    myChart.update();

                    // Continue with the next animation
                    animationIndex++;
                    animateSwap();
                }, ANIMATION_SPEED);
            }
        }

        // Start the animation
        animateSwap();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

    console.log("Quick Sort");
    console.log(data);
}

function bucketSort(data){
    console.log("Bucket Sort")
}

function radixSort(data){
    console.log("Radix Sort")
}

function insertionSort(data){
    console.log("Insertion Sort")
}

// Function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}