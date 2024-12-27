odoo.define('pos_hide_out_of_stock.ProductFilter', function(require) {
    'use strict';

    const models = require('point_of_sale.models');
    const PosDB = require('point_of_sale.DB');

    // Extender modelo de producto
    models.load_models([{
        model: 'product.product',
        fields: ['name', 'qty_available', 'type', 'available_in_pos'],
        domain: [['available_in_pos', '=', true], ['type', '=', 'product']],
        loaded: function(self, products) {
            // Filtrar productos con cantidad disponible mayor a 0
            const filteredProducts = products.filter(product => product.qty_available > 0);
            self.db.add_products(filteredProducts);
        },
    }], { 'after': 'product.product' });

    // Sobrescribir la función de la base de datos para devolver solo productos con stock
    PosDB.include({
        add_products: function(products) {
            const filteredProducts = products.filter(product => product.qty_available > 0);
            this._super(filteredProducts);
        },
    });
});