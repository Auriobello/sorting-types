#include <stdio.h>
#include <stdlib.h>
#include <time.h>

const int GRANDEZZA = 10;
const int MAX = 100;
const int MIN = 1;

/* ---------- Utility ---------- */
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

/* ---------- Quick‑Sort ---------- */
int partition(int arr[GRANDEZZA], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quicksort(int arr[GRANDEZZA], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}

/* ---------- Original helpers ---------- */
void riempiArr (int arr[GRANDEZZA]) {
    srand(time(NULL));
    for (int i = 0; i < GRANDEZZA; i++){
        arr[i] = (rand() % (MAX - MIN + 1)) + MIN;
    }
}

void stampaArr(int arr[GRANDEZZA]) {
    for(int i = 0; i < GRANDEZZA; i++){
        printf("%d\t", arr[i]);
    }
}

/* ---------- main ---------- */
void main (){
    int arr[GRANDEZZA];
    printf("\n---\tINIZIO\t---\n");

    riempiArr(arr);
    printf("\nArray non ordinato:\n");
    stampaArr(arr);

    quicksort(arr, 0, GRANDEZZA - 1);

    printf("\nArray ordinato:\n");
    stampaArr(arr);

    printf("\n---\tFINE\t---\n");
}