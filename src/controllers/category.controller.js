const { Category } = require('../models');


/*
CREATING - Category

*/
exports.createCategory = async (req, res) => {

  try {
    const category = await Category.create(req.body);
    res.status(201).json({message: "Category Created Successfully", data:[category]});
  } catch (err) {
    res.status(400).json({ message:"Unable to Create a Create !"});
  }
};

exports.getAllCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

exports.getCategory= async (req, res) => {

  const categoryId = req.params.id;
  if(!categoryId){
    res.status(404).json({message:"Category Id Missing !"})
  }
  try{
  const categories = await Category.findByPk(await categoryId.toString());
  res.json({message:"Category Getted Successfully",data:categories});
  }catch(error){
  res.status(400).json({ message:"Unable to Get a Category !"});
  }
};



/*
Deleting Category with Id
*/
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.category_id;

  if(!categoryId){
    res.status(422).json({message : "Opps, Category Id  Missing!"})
  }

  const categories = await Category.findByPk(categoryId);
  if(!categories){
    res.status(404).json({message : "Opps, Category Not Found!"})
  }

  categories.destroy()
  res.status(200).json({message : "Category Deleted Successfully", data : [categories]});
}
