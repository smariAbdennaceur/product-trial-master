
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private panierItems: Product[] = [];
  private panierItemsSubject = new BehaviorSubject<Product[]>(this.panierItems);
  panierItems$ = this.panierItemsSubject.asObservable();

  addToPanier(product: Product) {
    const existingProduct = this.panierItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.panierItems.push({ ...product, quantity: 1 });
    }
    this.updatePanier(this.panierItems);
  }

  removeFromPanier(product: Product) {
    this.panierItems = this.panierItems.filter(item => item.id !== product.id);
    this.updatePanier(this.panierItems);
  }

  updatePanier(updatedCart: Product[]) {
    this.panierItems = updatedCart;
    this.panierItemsSubject.next(this.panierItems);
  }
}
