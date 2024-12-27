{
    'name': 'POS Hide Out of Stock Products',
    'version': '1.0',
    'depends': ['point_of_sale', 'stock'],
    'category': 'Point of Sale',
    'summary': 'Hides products with zero stock in the POS interface.',
    'data': [],
    'assets': {
        'point_of_sale.assets': [
            'pos_hide_out_of_stock/static/src/js/product_filter.js',
        ],
    },
    'installable': True,
    'application': False,
}