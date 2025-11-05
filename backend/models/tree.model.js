const mongoose = require ('mongoose')

const Tree = mongoose.model ('tree', {
	name: String
})

module.exports = Tree;