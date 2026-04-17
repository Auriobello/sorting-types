#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MIN 0
#define MAX 100

void gnomeSort(int arr[], int n);
void swap(int *a, int *b);

int main () {
    srand(time(NULL));
    int vettore[10];
    int lunghezza = sizeof(vettore) / sizeof(vettore[0]);
    for (int i = 0; i < lunghezza; i++) {
        vettore[i] = MIN + rand() % (MAX - MIN + 1);
    }
    printf("Array: ");
    for (int i = 0; i < lunghezza; i++) {
        printf("%d ", vettore[i]);
    }
    gnomeSort(vettore, lunghezza);
    printf("\nArray ordinato: ");
    for (int i = 0; i < 10; i++) {
        printf("%d ", vettore[i]);
    }
}

void gnomeSort(int arr[], int n) {
    int index = 0;

    while (index < n) {
        if (index == 0)
            index++;
        if (arr[index] >= arr[index - 1])
            index++;
        else {
            swap(&arr[index], &arr[index - 1]);
            index--;
        }
    }
}

void swap(int *a, int *b) {
    int c = *b;
    *b = *a;
    *a = c;
}