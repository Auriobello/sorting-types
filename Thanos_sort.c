#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MIN 0
#define MAX 100

int arrayOrdinato(int arr[], int n);
int thanosSort(int arr[], int n);

int main() {
    srand(time(NULL));
    int vettore[10];
    int lunghezza = sizeof(vettore) / sizeof(vettore[0]);
    for (int i = 0; i < lunghezza; i++) {
        vettore[i] = MIN + rand() % (MAX - MIN + 1);
    }
    printf("Array disordinato: ");
    for (int i = 0; i < lunghezza; i++) {
        printf("%d ", vettore[i]);
    }
    int lunghezzaFin = thanosSort(vettore, lunghezza);
    printf("\nLunghezza finale: %d\n", lunghezzaFin);
    printf("Array ordinato: ");
    for (int i = 0; i < lunghezzaFin; i++) {
        printf("%d ", vettore[i]);
    }    
    return 0;
}

int arrayOrdinato(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return -1;
        }
    }
    return 0;
}

int thanosSort(int arr[], int n) {
    int controllo = arrayOrdinato(arr, n);
    if (controllo == 0) {
        return n;
    }
    else {
        return thanosSort(arr, n / 2);
    }
}