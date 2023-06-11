const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products, including its associated Category and Tag data
router.get('/', async (req, res) => {
  // find all products
  try {
    const productInfo = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productInfo);
  } catch (err) {
    res.status(500).json({message: "Error - Product Not Found!"});
  }
});

// get one product, including its associate Category and Tag data
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productInfo = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productInfo) {
      res.status(404).json({message: 'Product ID Not Found! Please Enter Valid ID#'});
      return;
    }
    res.status(200).json(productInfo);
  } catch (err) {
    res.status(500).json({message: 'Error - Invalid Product ID!'});
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
        return ProductTag.findAll({
          where: { product_id: req.params.id } });
        })
    .then((productTags) => {
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
            };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
  .then((product) => res.status(200).json(product))
  .catch((err) => {
    // To catch errors
    res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy(
    {where: {id: req.params.id}})
    .then((deletedProduct) => {
      if(!deletedProduct) {
        res.status(404).json({ message: "Product ID To Be Deleted Cannot Be Found!" });
        return;
      }
      res.status(200).json(deletedProduct);

    })
    .catch((err) => {
      // To catch errors
      res.status(400).json(err);
      });
  });

module.exports = router;
