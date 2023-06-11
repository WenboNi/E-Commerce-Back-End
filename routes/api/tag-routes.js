const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  //To find all tags, including the associated Product Data
  try {
    const tagInfo = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
  //To find a single tag by its 'id', including its associated Product Data
  try {
    const tagInfo = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagInfo) {
      res.status(404).json({ message: 'Tag ID Not Found! Please Enter Valid Tag ID' });
      return;
    }

    res.status(200).json(tagInfo);

  } catch (err) {
    res.status(500).json(err);
    } 
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagInfo = await Tag.create(req.body);
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
    }
});


  // update a tag's name by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const updatedTagInfo = await Tag.update(req.body, {where: { id: req.params.id }});
    if(!updatedTagInfo) {
      res.status(404).json({ message: "Tag ID Cannot Be Found!" });
      return;
    }
    res.status(200).json(updatedTagInfo);

  } catch (err) {
      res.status(500).json({ message: "Error - Unable to update Tag Name by ID" });
    }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({ where: { id: req.params.id } });
    if(!deletedTag) {
      res.status(404).json({ message: "Tag ID Cannot Be Found!" });
      return;
    }
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json({ message: "Error - Unable to delete Tag by ID" });
  }
});


module.exports = router;
