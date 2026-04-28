import Admin from "../models/Admin.js";

export const login = async (req, res) => {
    const{username, password} = req.body;

    const admin = await Admin.findOne({username, password});

    if(!admin){
        return res.status(400).json ({message:"Invalid credentials"});
    }

    req.session.admin = admin;
    res.status(200).json({message:"Login successful"});
};
 export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ message: "Logout successful" });
    });
 };
 