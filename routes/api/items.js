const express = require('express');
const router = express.Router();

const Items = require('../../Models/Items');

//@route GET api/items/getItems
//@desc Loads all files into items
//@access Public
router.get('/items/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const items = await Items.findOne({ userId });

        if (!items) {
            return res.status(400).send('Пока у вас нет товаров, чтобы обменяться! Добавьте новый товар!');
        }
         return res.status(200).send(items.items);
    } catch (err) {
        return res.status(500).send(err);
    }
});



module.exports = router;