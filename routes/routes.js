var express    = require('express');        // call express

// import models
var ProductQuantity = require('../models/product_quantity');

// get an instance of the express Router, allowing us to add
// middleware and register our API routes as needed
var router = express.Router();

// create/update a productQuantity
router.put('/product_quantities/:product_id', function(req, res) {

    if (req.body.quantity_onhand == null) {
	res.status(400);
	res.setHeader('Content-Type', 'application/vnd.error+json');
	res.json({ message: "quantity_onhand parameter is required"});
    }  else
    {

        ProductQuantity.findOne({ product_id: req.params.product_id}, function(err, productQuantity) {
	    if (err) return console.error(err);

	    var created = false; // track create vs. update
	    if (productQuantity == null) {
		productQuantity = new ProductQuantity();
		productQuantity.product_id = req.params.product_id;
		created = true;
	    }

	    // set/update the onhand quantity and save
	    productQuantity.quantity_onhand = req.body.quantity_onhand;
	    productQuantity.save(function(err) {
		if (err) {
		    res.status(500);
		    res.setHeader('Content-Type', 'application/vnd.error+json');
		    res.json({ message: "Failed to save productQuantity"});
		} else {
		    // return the appropriate response code, based
		    // on whether we created or updated a ProductQuantity
		    if (created) {
			res.status(201);
		    } else {
			res.status(200);
		    }

		    res.setHeader('Content-Type', 'application/hal+json');

		    var resource = halson({
			product_id: productQuantity.product_id,
			quantity_onhand: productQuantity.quantity_onhand,
			created_at: productQuantity.created_at
		    }).addLink('self', '/product_quantities/'+productQuantity.product_id)

		    res.send(JSON.stringify(resource));
		}
	    });
	});
    }
});

router.get('/product_quantities/:product_id', function(req, res) {
    ProductQuantity.findOne({product_id: req.params.product_id}, function(err, productQuantity) {
        if (err) {
	    res.status(500);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "Failed to fetch ProductQuantities"});
	} else if (productQuantity == null) {
	    res.status(404);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "ProductQuantity not found for product_id "+req.params.product_id});
	} else {
	    res.status(200);
	    res.setHeader('Content-Type', 'application/hal+json');

	    var resource = halson({
		product_id: productQuantity.product_id,
		quantity_onhand: productQuantity.quantity_onhand,
		created_at: productQuantity.created_at
	    }).addLink('self', '/product_quantities/'+productQuantity.product_id)
	    res.send(JSON.stringify(resource));

	}
    });
});
