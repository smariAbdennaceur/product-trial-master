import { Component, OnInit } from '@angular/core';
import { PanierService } from 'app/products/data-access/panier.service';
import { Product } from 'app/products/data-access/product.model';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss'],
  standalone: true,
  imports: [ButtonModule, CommonModule],
})
export class PanierComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.panierService.panierItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(product: Product) {
    this.panierService.removeFromPanier(product);
  }

  increaseQuantity(product: Product) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      this.panierService.updatePanier(this.cartItems);
    }
  }

  decreaseQuantity(product: Product) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct && existingProduct.quantity && existingProduct.quantity > 1) {
      existingProduct.quantity--;
      this.panierService.updatePanier(this.cartItems);
    } else {
      this.removeFromCart(product); 
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  getTotalQuantity() {
    return this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }
}
