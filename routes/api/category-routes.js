const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories, including its associated products
  try {
    const categoryInfo = await Category.findAll({
      include: [{ model:Product }],
    });
    res.status(200).json(categoryInfo);
  } catch (err) {
    // to handle errors
    res.status(500).json({ message: "Error Encountered, Please Input Valid Option"})
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value, including its associated Products
  try {
    const categoryInfo = await Category.findByPk(req.params.id, {
      include: [{ model:Product }],
    });
    if (!categoryInfo) {
      res.status(404).json({ message: "Category ID cannot be found, Please re-enter valid ID#"});
    }

    res.status(200).json(categoryInfo);
  
  } catch (err) {
    // to handle errors
    res.status(500).json({ message: "Error Encountered, Please Input Valid Option"});
  }
});


router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategoryInfo = await Category.create(req.body);
    res.status(200).json(newCategoryInfo);
  } catch (err) {
    // to handle errors
    res.status(500).json({ message: "Error - Unable to Create New Category"});
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: { id: req.params.id },
    }
  ).then((updatedCategoryInfo) => {
      res.json(updatedCategoryInfo);
    }
  ).catch((err) => {
      res.status(500).json(err, { message: "Error - Failed to Update Category ID"});
  })

});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy( {
    where: { id: req.params.id },
    }
  ).then((deletedCategoryInfo) => {
      if (!deletedCategoryInfo) {
        res.status(404).json({ message: "Error - Category ID Cannot Be Found"});
        return;
      }
      res.json(deletedCategoryInfo);
   }
  ).catch((err) => {
    res.status(500).json(err, { message: "Error - Failed to Delete Category by ID"});
})
});

module.exports = router;
