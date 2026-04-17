#include <stdio.h>
#include <stdlib.h>
#include <time.h>

const int GRANDEZZA = 10;
const int MAX = 100;
const int MIN = 1;

void riempiArr (int arr[GRANDEZZA]) {
    srand(time(NULL));
    for (int i = 0; i < GRANDEZZA; i++){
        arr[i] = (rand() % (MAX - MIN + 1)) + MIN;
    }
}

void ordinamentoArr(int arr[]) {
    int swapped = 1;
    int start = 0;              //Variabile inizio
    int end = GRANDEZZA - 1;    /*variabile per la fine dell'array
                                (-1, tanto il primo è per forza il più grande)*/

    while (swapped) {
        swapped = 0;

        // Passaggio da sinistra a destra
        for (int i = start; i < end; ++i) { //i da inizio (0) a fine (end)
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = 1;
            }
        }

        // Se non ci sono stati scambi, l'array è ordinato
        if (!swapped)
            break;

        swapped = 0;
        --end;

        // Passaggio da destra a sinistra
        for (int i = end - 1; i >= start; --i) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = 1;
            }
        }

        ++start;
    }
}

void stampaArr(int arr[GRANDEZZA]) {
    
    for(int i = 0; i < GRANDEZZA; i++){
        printf("%d\t", arr[i]);
    }
}

void main (){

    int arr[GRANDEZZA];
    printf("\n---\tINIZIO\t---\n");

    riempiArr(arr);
    printf("\nArray non ordinato:\n");
    stampaArr(arr);
    ordinamentoArr(arr);
    printf("\nArray ordinato:\n");
    stampaArr(arr);

    printf("\n---\tFINE\t---\n");
}
