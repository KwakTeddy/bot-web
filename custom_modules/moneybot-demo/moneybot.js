var Product = mongoose.model('Product');

function fin_product(task, context, callback) {
  Product.find({category: task.category}).sort('-rate').exec(function (err, products) {
    task.doc = products;
    callback(task, context);
  });
}

exports.fin_product = fin_product;

