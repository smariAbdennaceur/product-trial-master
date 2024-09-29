import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly path = "http://localhost:3000/api/products";
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            catchError((error) => {
                return this.http.get<Product[]>("assets/products.json");
            }),
            tap((products) => this._products.set(products)),
        );
    }

    public getWithPagination(
        page: number = 1,
        limit: number = 10,
        search: string = '',
        sort: string = 'id',
        order: string = 'asc'
      ): Observable<{ products: Product[], totalItems: number, totalPages: number, currentPage: number }> {
    
        let params = new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString())
          .set('search', search)
          .set('sort', sort)
          .set('order', order);
    
        return this.http.get<{ products: Product[], totalItems: number, totalPages: number, currentPage: number }>(this.path, { params }).pipe(
          catchError((error) => {
            console.error('Error fetching products with pagination from API, falling back to local assets.', error);
            return this.http.get<{ products: Product[], totalItems: number, totalPages: number, currentPage: number }>("assets/products.json");
          }),
          tap((response) => this._products.set(response.products)),
        );
      }
    

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.path, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}