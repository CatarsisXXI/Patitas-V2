# TODO List for Project Changes

## Frontend Changes
- [x] Modify CarritoPage.js: Change "Proceder al Pago" button to "Comprar", generate WhatsApp message with cart items, redirect to WhatsApp, and call new API to create pending order and clear cart.
- [x] Modify Navbar.js: Hide "Mis Compras" option for non-admin users.

## Backend Changes
- [x] Modify PedidosController.cs: Add new endpoint for creating pending order without payment validation, set status to "Pendiente", clear cart after creation.
- [x] Modify AdminController.cs: Add endpoints to update order status and shipping address.
- [x] Update statistics logic: When order status changes to "Pagado", decrease product stock and add to total sales.
- [x] Create/Update DTOs if necessary for admin actions.

## Admin Interface Changes
- [x] Modify OrderManagementPage.js: Add buttons to change order status and edit shipping address.
- [x] Update order statuses to only include: Pendiente, Pagado, Cancelado.
- [x] Add colors: yellow for Pendiente, green for Pagado, red for Cancelado.
- [x] Show "Dirección" button for Pagado status and "Motivos" button for Cancelado status.
- [x] Update dialog titles and labels based on status.

## Additional Changes
- [x] Add WhatsApp icon to the "Comprar" button.
- [x] Set DireccionEnvio to empty string for pending orders.

## Testing
- [ ] Test the complete flow: Add to cart, click "Comprar", redirect to WhatsApp, order created as pending, admin can change status, stock decreases, sales update.
