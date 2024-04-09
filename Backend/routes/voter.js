const express= require("express");
const Voter=require('../models/voter')
const VoterAddress = require('../models/voter-add'); // Import the VoterAddress model
const CandidateAddress = require('../models/candidate-add');
const Candidate = require('../models/candidate'); // Import the Candidate model


const router = express.Router();
router.use(express.json());

// router.get("/signup",(req,res)=>{
//     return res.status(201).json({msg:"pending"});
// });

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, aadharNumber, mobileNumber, password } = req.body;
    try {
        const newVoter = await Voter.create({
            firstName,
            lastName,
            email,
            aadharNumber,
            mobileNumber,
            password,
        });
        return res.status(201).json({ msg: "success", voter: newVoter._id,token:req.cookies.token });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


router.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    try {
        
        const token =await Voter.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).status(201).json({ msg: "success",token });
    } catch (error) {
        return res.status(301).json({
            error:"Incorrect Email or Password",
        });
    }

});


router.post('/add-voter', async (req, res) => {
    const { street, city, state, pinCode } = req.body;
    const voterId = req.user._id; // Assuming the authenticated user's ID is stored in req.user._id

    try {
        const newAddress = await VoterAddress.create({
            voter: voterId,
            street,
            city,
            state,
            pinCode,
        });

        return res.status(201).json({ msg: "Address added successfully", address: newAddress });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});





router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/signin");
});




module.exports=router;