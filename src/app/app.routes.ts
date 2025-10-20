import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DefaultLayoutComponent } from './layouts/default-layout.component';


export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: '/products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'admin', component: AdminComponent }
    ]
  }
];
