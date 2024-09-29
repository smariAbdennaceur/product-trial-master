import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 
import { MessageService } from 'primeng/api';
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { PanierService } from "app/products/data-access/panier.service";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    CardModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    DropdownModule,
    ProgressSpinnerModule,
  ],
})

export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  public readonly products = this.productsService.products;
  public filteredProducts: Product[] = [];
  public currentPageData: Product[] = [];
  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>({ ...emptyProduct });
  public categories: { label: string, value: string }[] = [];
  public selectedCategory: string = '';
  public searchQuery: string = '';
  public cartBadgeCount = 0;
  public isLoading = false; 
  

  constructor(private messageService: MessageService, private panierService: PanierService) {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.isLoading = true;
    this.productsService.get().subscribe(
      (products) => {
        this.filteredProducts = products;
        this.initializeCategories(products);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private initializeCategories(products: Product[]) {
    const categorySet = new Set(products.map((product) => product.category));
    this.categories = [
      { label: 'Tous', value: '' },
      ...Array.from(categorySet).map((category) => ({ label: category, value: category })),
    ];
  }

  public filterProducts() {
    this.isLoading = true;
    setTimeout(() => {
      const search = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products().filter(product => {
        const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
        const matchesSearch = !this.searchQuery || product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
      });
     
      this.isLoading = false;
    }, 500); 
  }

 

  public addProduit(product: Product) {
    this.panierService.addToPanier(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Produit ajouté au panier',
    });
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set({ ...emptyProduct });
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe(() => this.loadProducts());
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe(() => this.loadProducts());
    } else {
      this.productsService.update(product).subscribe(() => this.loadProducts());
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
