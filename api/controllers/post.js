import { ObjectId } from "mongodb";
import { posts, users } from "../db.js";
import jwt from "jsonwebtoken";

const postResponse = (post) => ({ ...post, id: post._id.toString(), _id: undefined });

export const getPosts = (req, res) => {
  const getAllPosts = async () => {
    const filter = req.query.cat ? { cat: req.query.cat } : {};
    const data = await posts.find(filter).sort({ date: -1 }).toArray();
    return res.status(200).json(data.map(postResponse));
  };
  getAllPosts().catch((err) => res.status(500).send(err));
};

export const getPost = (req, res) => {
  const getSinglePost = async () => {
    if (!ObjectId.isValid(req.params.id)) return res.status(404).json("Post not found!");
    const post = await posts.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json("Post not found!");
    const user = await users.findOne({ _id: new ObjectId(post.uid) });
    return res.status(200).json({
      ...postResponse(post),
      username: user?.username,
      userImg: user?.img,
    });
  };
  getSinglePost().catch((err) => res.status(500).json(err));
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    posts.insertOne({
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      cat: req.body.cat,
      date: req.body.date || new Date(),
      uid: userInfo.id,
    })
      .then(() => res.json("Post has been created."))
      .catch((dbError) => res.status(500).json(dbError));
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!ObjectId.isValid(req.params.id)) return res.status(403).json("You can delete only your post!");
    posts.deleteOne({ _id: new ObjectId(req.params.id), uid: userInfo.id })
      .then((result) => {
        if (!result.deletedCount) return res.status(403).json("You can delete only your post!");
        return res.json("Post has been deleted!");
      })
      .catch(() => res.status(403).json("You can delete only your post!"));
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!ObjectId.isValid(req.params.id)) return res.status(500).json("Post not found!");
    posts.updateOne(
      { _id: new ObjectId(req.params.id), uid: userInfo.id },
      { $set: { title: req.body.title, desc: req.body.desc, img: req.body.img, cat: req.body.cat } }
    )
      .then(() => res.json("Post has been updated."))
      .catch((dbError) => res.status(500).json(dbError));
  });
};
