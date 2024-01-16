from django.shortcuts import render
from django.http import JsonResponse
import json

# Create your views here.
def home(request):
    return render(request, 'index.html')

def sorting(request):
    return render(request, 'sorting.html')

def searching(request):
    return render(request, 'searching.html')

def selection(request):
    if request.method == 'POST':
        # Get the array from the AJAX request
        data = request.POST.getlist('array[]', [])[0].split(",")
        
        # Convert the data to integers
        array = [int(num) for num in data]
        
        # Perform selection sort and record swap indexes
        swap_indexes = []
        n = len(array)

        for i in range(n - 1):
            min_index = i
            for j in range(i + 1, n):
                if array[j] < array[min_index]:
                    min_index = j

            # Swap elements
            array[i], array[min_index] = array[min_index], array[i]

            # Record swap indexes
            swap_indexes.append([i, min_index])

        # Return the sorted array and swap indexes as JSON response
        response_data = {
            'sorted_array': array,
            'swap_indexes': swap_indexes,
        }
        return JsonResponse(response_data)

    # Handle GET requests or other HTTP methods
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def merge(request):
    if request.method == 'POST':
        # Get the array from the AJAX request
        data = request.POST.getlist('array[]', [])[0].split(",")
        
        # Convert the data to integers
        array = [int(num) for num in data]

        # Initialize animation data
        animation_data = {'steps': []}

        # Return sorted array and animation data as JSON response
        merge_sort(array, animation_data)
        return JsonResponse(animation_data)

    # Handle GET requests or other HTTP methods
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def merge_sort(data, animation_data, start=0, end=None):
    if end is None:
        end = len(data) - 1

    if start < end:
        mid = (start + end) // 2

        # Recursively divide the array into two halves
        merge_sort(data, animation_data, start, mid)
        merge_sort(data, animation_data, mid + 1, end)

        # Merge the sorted halves
        merge_helper(data, animation_data, start, mid, end)

def merge_helper(arr, animation_data, start, mid, end):
    i = start
    j = mid + 1
    k = 0

    merged_array = []

    # Merge the sorted halves into a temporary array
    while i <= mid and j <= end:
        if arr[i] < arr[j]:
            merged_array.append(arr[i])
            i += 1
        else:
            merged_array.append(arr[j])
            j += 1
        k += 1

    # Copy the remaining elements of left and right arrays, if any
    while i <= mid:
        merged_array.append(arr[i])
        i += 1
        k += 1

    while j <= end:
        merged_array.append(arr[j])
        j += 1
        k += 1

    # Update the original array with the merged values
    for i in range(k):
        arr[start + i] = merged_array[i]

    # Store animation data for visualization
    animation_data['steps'].append({
        'start': start,
        'end': end,
        'merged_array': merged_array.copy(),
    })

# Function to find the partition position and perform swaps
def partition(array, low, high, swaps):
    pivot = array[high]
    i = low - 1
    print('current array: ', array[low:high] )

    for j in range(low, high):
        if array[j] <= pivot:
            i += 1
            (array[i], array[j]) = (array[j], array[i])
            swaps.append((i, j))

    (array[i + 1], array[high]) = (array[high], array[i + 1])
    swaps.append((i + 1, high))

    return i + 1

# Function to perform quicksort and return swaps
def quickSort(array, low, high, swaps):
    if low < high:
        pi = partition(array, low, high, swaps)
        quickSort(array, low, pi - 1, swaps)
        quickSort(array, pi + 1, high, swaps)

# Django view function
def quick(request):
    if request.method == 'POST':
        # Get the array from the AJAX request
        data = request.POST.getlist('array[]', [])[0].split(",")    
        print("Unsorted Array")
        print(data)

        size = len(data)
        swaps = []

        quickSort(data, 0, size - 1, swaps)

        print('Sorted Array in Ascending Order:')
        print(data)

        response_data = {
            'original_array': data,
            'animations': swaps,
            'sorted_array': data.copy()
        }

        return JsonResponse(response_data)
    
    # Handle GET requests or other HTTP methods
    return JsonResponse({'error': 'Invalid request method'}, status=400)