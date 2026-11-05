import connectToDB from "@/configs/db";
import CategoryModel from "@/model/category";

export const handleTree = async () => {
    await connectToDB();
    const categories = await CategoryModel.find({}).lean();

    const map = {};
    const tree = [];

    categories.forEach(cat => {
        map[String(cat._id)] = {
            _id: String(cat._id),
            name: cat.slug,
            children: []
        };
    });

    categories.forEach(cat => {
        if (cat.parentId) {
            const parent = map[String(cat.parentId)];
            if (parent) {
                parent.children.push(map[String(cat._id)]);
            }
        } else {
            tree.push(map[String(cat._id)]);
        }
    });

    return tree;
};