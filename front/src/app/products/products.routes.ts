import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { ProductListComponent } from "./features/product-list/product-list.component";
import { PanierComponent } from "./features/panier/panier.component";

export const PRODUCTS_ROUTES: Routes = [
	{
		path: "list",
		component: ProductListComponent,
	},
	{
		path: "Panier",
		component: PanierComponent,
	},
	{ path: "**", redirectTo: "list" },
];
