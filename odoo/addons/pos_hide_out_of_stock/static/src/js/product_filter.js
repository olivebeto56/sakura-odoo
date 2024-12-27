odoo.define('pos_hide_out_of_stock.ProductFilter', function(require) {
    'use strict';

    const models = require('point_of_sale.models');
    const PosDB = require('point_of_sale.DB');

    // Log para confirmar la carga del archivo
    console.log('Cargando módulo POS Hide Out of Stock Products');

    models.load_models([{
        model: 'product.product',
        fields: ['name', 'qty_available', 'type', 'available_in_pos'],
        domain: [['available_in_pos', '=', true], ['type', '=', 'product']],
        loaded: function(self, products) {
            console.log('Productos cargados:', products.length);
            const filteredProducts = products.filter(product => product.qty_available > 0);
            console.log('Productos después del filtro:', filteredProducts.length);
            self.db.add_products(filteredProducts);
        },
    }], { 'after': 'product.product' });

    PosDB.include({
        add_products: function(products) {
            console.log('Añadiendo productos a la base de datos del POS');
            const filteredProducts = products.filter(product => product.qty_available > 0);
            this._super(filteredProducts);
        },
    });
});