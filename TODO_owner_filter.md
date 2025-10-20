# TODO: Implement Owner Filtering for Products

## Backend Updates
- [x] Add ownerId query param to ProductController.findAll
- [x] Pass ownerId through ProductService.findAll
- [x] Filter by userId in ProductRepository.findAll if ownerId provided

## Frontend Updates
- [x] Add ownerId param to ProductService.getProducts
- [x] In ProductsComponent: inject AuthService, check login status, default to own products if logged in
- [x] Add toggle logic: showAllProducts boolean, toggle method to switch and reload
- [x] Update HTML: add toggle button for logged-in users

## Testing
- [ ] Test login/logout behavior and toggle functionality
- [ ] Verify category filtering works with owner filtering
