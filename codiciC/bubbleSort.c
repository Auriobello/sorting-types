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

void ordinamentoArr (int arr[GRANDEZZA]) {

    int temp;
    for (int i = 0 ; i < GRANDEZZA - 1; i++) {
        for (int j = 0 ; j < GRANDEZZA - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
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