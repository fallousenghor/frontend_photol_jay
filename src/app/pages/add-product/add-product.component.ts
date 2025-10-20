import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';
import { Category, Product } from '../../models/product.interface';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  images: { base64: string; url: string }[] = [];
  categories: Category[] = [];
  isEditing = false;
  editingProductId?: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cameraService: CameraService
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.min(0), Validators.pattern(/^\d*\.?\d*$/)]],
      categoryId: [null, [Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // Check if we're editing a product
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.isEditing = true;
        this.editingProductId = parseInt(params['edit']);
        this.loadProductForEditing(this.editingProductId);
      }
    });
  }

  loadProductForEditing(productId: number): void {
    this.productService.getProduct(productId.toString()).subscribe({
      next: (product) => {
        if (product) {
          // Check if user owns this product
          const currentUserId = this.authService.getUserId();
          if (currentUserId !== product.userId) {
            this.errorMessage = 'Vous ne pouvez modifier que vos propres produits';
            this.router.navigate(['/products']);
            return;
          }

          // Populate form with product data
          this.productForm.patchValue({
            title: product.title,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId?.toString()
          });

          // Load existing images
          if (product.images && product.images.length > 0) {
            this.images = product.images.map(img => ({
              base64: '', // We don't have base64 for existing images
              url: img.url
            }));
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du produit';
        this.router.navigate(['/products']);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  async takePhoto(): Promise<void> {
    if (this.images.length >= 3) {
      this.errorMessage = 'Vous pouvez ajouter jusqu\'à 3 images par produit.';
      return;
    }
    try {
      const base64 = await this.cameraService.takePhoto();
      if (base64) {
        const file = this.base64ToFile(base64, `photo-${Date.now()}.jpg`);
        const url = URL.createObjectURL(file);
        this.images.push({ base64, url });
        this.errorMessage = ''; // Clear any previous error
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      if (error.message?.includes('User cancelled')) {
        // User cancelled, no error message needed
      } else if (error.message?.includes('Permission denied')) {
        this.errorMessage = 'Permission d\'accès à la caméra refusée';
      } else {
        this.errorMessage = 'Erreur lors de la prise de photo. Vérifiez les permissions de la caméra.';
      }
    }
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const userId = this.authService.getUserId();
      if (!userId) {
        this.errorMessage = 'Utilisateur non connecté';
        return;
      }

      const formValue = this.productForm.value;
      const productData: any = {
        title: formValue.title,
        description: formValue.description,
        userId,
        price: formValue.price ? parseFloat(formValue.price) : undefined,
        categoryId: formValue.categoryId ? parseInt(formValue.categoryId) : undefined,
        ...(this.isEditing ? {} : { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }) // Only set expiry for new products
      };

      // Debug log
      console.log('Form Value:', this.productForm.value);
      console.log('Sending product data:', productData);

      const operation = this.isEditing
        ? this.productService.updateProduct(this.editingProductId!.toString(), productData)
        : this.productService.createProduct(productData);

      operation.subscribe({
        next: (product) => {
          console.log('Product saved:', product);

          // Handle image uploads for new products or new images added during edit
          const newImages = this.images.filter(img => img.base64); // Only upload images with base64 data
          if (newImages.length > 0) {
            let uploadedCount = 0;
            newImages.forEach((img, index) => {
              const file = this.base64ToFile(img.base64, `photo-${index}.jpg`);
              this.productService.uploadImage(product.id.toString(), file).subscribe({
                next: () => {
                  uploadedCount++;
                  if (uploadedCount === newImages.length) {
                    this.successMessage = this.isEditing ? 'Produit modifié avec succès!' : 'Produit et images ajoutés avec succès!';
                    this.productForm.reset();
                    this.images = [];
                  }
                },
                error: (err) => {
                  console.error('Upload error:', err);
                  this.errorMessage = 'Le produit a été sauvegardé mais il y a eu une erreur lors du téléchargement des images';
                }
              });
            });
          } else {
            this.successMessage = this.isEditing ? 'Produit modifié avec succès!' : 'Produit ajouté avec succès!';
            this.productForm.reset();
            this.images = [];
          }
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          if (error.error?.issues) {
            // Zod validation errors
            const issues = error.error.issues;
            const errorMessages = issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
            this.errorMessage = `Erreur de validation: ${errorMessages.join(', ')}`;
          } else if (error.error?.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = this.isEditing ? 'Erreur lors de la modification du produit.' : 'Erreur lors de l\'ajout du produit. Vérifiez les champs et réessayez.';
          }
        }
      });
    } else {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
    }
  }
}
