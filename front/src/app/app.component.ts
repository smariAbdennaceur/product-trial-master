import {
  Component,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { PanierService } from "./products/data-access/panier.service";
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent,BadgeModule],
})
export class AppComponent {

  title = "ALTEN SHOP";
  cartCount = 0;
 
  constructor(private panierService: PanierService,private router: Router) {
    this.panierService.panierItems$.subscribe(items => {
      this.cartCount = items.length;
    });
  }

  showPanier() {
    this.router.navigate(['products/Panier']);
  }
}
