odoo.define('pos_hide_out_of_stock.models', function(require) {
    'use strict';

    const models = require('point_of_sale.models');

    // Extendemos el modelo de producto para filtrar los productos sin stock
    models.load_models([{
        model: 'product.product',
        fields: ['name', 'qty_available', 'type', 'available_in_pos'],
        domain: [['available_in_pos', '=', true], ['type', '=', 'product']],
        loaded: function(self, products) {
            // Filtramos productos con cantidad disponible mayor a 0
            self.db.add_products(products.filter(product => product.qty_available > 0));
        },
    }], { 'after': 'product.product' });
});